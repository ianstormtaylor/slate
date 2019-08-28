import Debug from 'debug'

import Annotation from '../models/annotation'
import Operation from '../models/operation'
import Mark from '../models/mark'
import PathUtils from '../utils/path-utils'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation:apply')

/**
 * Apply an `op` to a `value`.
 *
 * @param {Value} value
 * @param {Object|Operation} op
 * @return {Value} value
 */

function applyOperation(value, op) {
  op = Operation.create(op)
  const { type } = op
  debug(type, op)

  switch (type) {
    case 'add_annotation': {
      const { annotation } = op
      const { key } = annotation
      const { annotations } = value
      const newAnnotations = annotations.set(key, annotation)
      const newValue = value.set('annotations', newAnnotations)
      return newValue
    }

    case 'add_mark': {
      const { path, mark } = op
      const { document } = value
      const node = document.assertNode(path)
      const { marks } = node
      const newMarks = marks.add(mark)
      const newNode = node.set('marks', newMarks)
      const newDocument = document.replaceNode(path, newNode)
      const newValue = value.set('document', newDocument)
      return newValue
    }

    case 'insert_node': {
      const { path, node } = op
      const { document } = value
      const index = path.last()
      const parentPath = PathUtils.lift(path)
      const parentNode = document.assertNode(parentPath)
      const newParentNodes = parentNode.nodes.splice(index, 0, node)
      const newParentNode = parentNode.set('nodes', newParentNodes)
      const newDocument = document.replaceNode(parentPath, newParentNode)

      const newValue = mapPoints(value.set('document', newDocument), point => {
        const newPaths = PathUtils.transform(point.path, op)
        const newPath = newPaths.first()
        const newPoint = point.setPath(newPath).setKey(null)
        return newPoint
      })

      return newValue
    }

    case 'insert_text': {
      const { path, offset, text } = op
      const { document } = value
      const node = document.assertNode(path)
      const newText =
        node.text.slice(0, offset) + text + node.text.slice(offset)
      const newNode = node.set('text', newText)
      const newDocument = document.replaceNode(path, newNode)

      const newValue = mapPoints(value.set('document', newDocument), point => {
        if (point.path.equals(path) && point.offset >= offset) {
          return point.setOffset(point.offset + text.length)
        } else {
          return point
        }
      })

      return newValue
    }

    case 'merge_node': {
      const { path, position } = op
      const { document } = value
      const withPath = PathUtils.decrement(path)
      const parentPath = PathUtils.lift(path)
      const index = withPath.last()
      const parent = document.assertNode(parentPath)
      const a = document.assertNode(withPath)
      const b = document.assertNode(path)

      const newNode =
        a.object === 'text'
          ? a.mergeText(b)
          : a.set('nodes', a.nodes.concat(b.nodes))

      const newParentNodes = parent.nodes.splice(index, 2, newNode)
      const newParent = parent.set('nodes', newParentNodes)
      const newDocument = document.replaceNode(parentPath, newParent)

      const newValue = mapPoints(value.set('document', newDocument), point => {
        if (point.path.equals(path)) {
          const newPath = PathUtils.decrement(point.path)
          const newOffset = point.offset + position
          return point.moveTo(newPath, newOffset).setKey(null)
        } else if (PathUtils.isAbove(path, point.path)) {
          let newPath = PathUtils.decrement(point.path, 1, path.size - 1)
          newPath = PathUtils.increment(newPath, position, path.size)
          return point.setPath(newPath).setKey(null)
        } else if (PathUtils.isYounger(path, point.path)) {
          const newPath = PathUtils.decrement(point.path, 1, path.size - 1)
          return point.setPath(newPath).setKey(null)
        } else {
          return point
        }
      })

      return newValue
    }

    case 'move_node': {
      const { path } = op
      const { document } = value
      const index = path.last()
      const parentPath = PathUtils.lift(path)
      const node = document.assertNode(path)
      const parent = document.assertNode(parentPath)
      const nextParentNodes = parent.nodes.splice(index, 1)
      const nextParent = parent.set('nodes', nextParentNodes)
      let nextDocument = document.replaceNode(parentPath, nextParent)

      // This is a bit tricky, but since the `path` and `newPath` both refer to
      // the same snapshot in time, after either inserting or removing as the
      // first step, the second step's path can be out of date. So instead of
      // using the `op.newPath` directly, we transform `op.path` to ascertain
      // what the `newPath` would be after the operation was applied.
      const newPath = PathUtils.transform(path, op).first()

      const newIndex = newPath.last()
      const newParentPath = PathUtils.lift(newPath)
      const newParent = nextDocument.assertNode(newParentPath)
      const nextNewParentNodes = newParent.nodes.splice(newIndex, 0, node)
      const nextNewParent = newParent.set('nodes', nextNewParentNodes)
      nextDocument = nextDocument.replaceNode(newParentPath, nextNewParent)

      const nextValue = mapPoints(
        value.set('document', nextDocument),
        point => {
          const nextPath = PathUtils.transform(point.path, op).first()
          return point.setPath(nextPath).setKey(null)
        }
      )

      return nextValue
    }

    case 'remove_annotation': {
      const { annotation } = op
      const { key } = annotation
      const { annotations } = value
      const newAnnotations = annotations.delete(key)
      const newValue = value.set('annotations', newAnnotations)
      return newValue
    }

    case 'remove_mark': {
      const { path, mark } = op
      const { document } = value
      const node = document.assertNode(path)
      const { marks } = node
      const newMarks = marks.remove(mark)
      const newNode = node.set('marks', newMarks)
      const newDocument = document.replaceNode(path, newNode)
      const newValue = value.set('document', newDocument)
      return newValue
    }

    case 'remove_node': {
      const { path } = op
      const { document } = value
      const index = path.last()
      const parentPath = PathUtils.lift(path)
      const parentNode = document.assertNode(parentPath)
      const newParentNodes = parentNode.nodes.splice(index, 1)
      const newParentNode = parentNode.set('nodes', newParentNodes)
      const newDocument = document.replaceNode(parentPath, newParentNode)

      const prev = document.previousText(path)
      const next = document.nextText(path)

      const newValue = mapPoints(value.set('document', newDocument), point => {
        const newPath = PathUtils.transform(point.path, op).first()

        if (newPath) {
          return point.setPath(newPath).setKey(null)
        } else if (prev) {
          const [prevNode, prevPath] = prev
          return point.moveTo(prevPath, prevNode.text.length).setKey(null)
        } else if (next) {
          let [, nextPath] = next
          nextPath = PathUtils.transform(nextPath, op).first()
          return point.moveTo(nextPath, 0).setKey(null)
        } else {
          return point.unset()
        }
      })

      return newValue
    }

    case 'remove_text': {
      const { path, offset, text } = op
      const { length } = text
      const { document } = value
      const node = document.assertNode(path)
      const newText =
        node.text.slice(0, offset) + node.text.slice(offset + length)
      const newNode = node.set('text', newText)
      const newDocument = document.replaceNode(path, newNode)

      const newValue = mapPoints(value.set('document', newDocument), point => {
        const isEqual = point.path.equals(path)
        const isEnd = point.offset >= offset + length
        const isStart = point.offset > offset

        if (isEqual && isEnd) {
          return point.setOffset(point.offset - length)
        } else if (isEqual && isStart) {
          return point.setOffset(offset)
        } else {
          return point
        }
      })

      return newValue
    }

    case 'set_annotation': {
      const { properties, newProperties } = op
      const { annotations } = value
      const newAnnotation = Annotation.create({
        ...properties,
        ...newProperties,
      })

      const { key } = newAnnotation
      const newAnnotations = annotations.set(key, newAnnotation)
      const newValue = value.set('annotations', newAnnotations)
      return newValue
    }

    case 'set_mark': {
      const { path, properties, newProperties } = op
      const { document } = value
      const mark = Mark.create(properties)
      const newMark = Mark.create({ ...properties, ...newProperties })
      const node = document.assertNode(path)
      const { marks } = node
      const newMarks = marks.remove(mark).add(newMark)
      const newNode = node.set('marks', newMarks)
      const newDocument = document.replaceNode(path, newNode)
      const newValue = value.set('document', newDocument)
      return newValue
    }

    case 'set_node': {
      const { path, newProperties } = op
      const { document } = value
      const node = document.assertNode(path)
      const newNode = node.merge(newProperties)
      const newDocument = document.replaceNode(path, newNode)
      const newValue = value.set('document', newDocument)
      return newValue
    }

    case 'set_selection': {
      const { newProperties } = op
      const { document, selection } = value
      let newSelection = selection.setProperties(newProperties)

      // TODO: this should not be required, and seems actively bad. The op
      // should come in with correct properties already, so they shouldn't need
      // to be resolved again.
      newSelection = document.resolveSelection(newSelection)

      const newValue = value.set('selection', newSelection)
      return newValue
    }

    case 'set_value': {
      const { newProperties } = op
      const { document } = value
      let { data, annotations } = newProperties
      let newValue = value

      if (data) {
        newValue = newValue.set('data', data)
      }

      if (annotations) {
        // TODO: this should not happen, because again the ranges should already
        // be resolved relative to the document when the operation is created.
        annotations = annotations.map(
          a => (a.isSet ? a : document.resolveAnnotation(a))
        )

        newValue = newValue.set('annotations', annotations)
      }

      return newValue
    }

    case 'split_node': {
      const { path, position, properties } = op
      const { document } = value
      const node = document.assertNode(path)
      let a
      let b

      if (node.object === 'text') {
        ;[a, b] = node.splitText(position)
      } else {
        const befores = node.nodes.take(position)
        const afters = node.nodes.skip(position)
        a = node.set('nodes', befores)
        b = node.set('nodes', afters).regenerateKey()

        // TODO: remove this conditional, and always merge these
        if (properties) {
          b = b.merge(properties)
        }
      }

      const parentPath = PathUtils.lift(path)
      const parent = document.assertNode(parentPath)
      const index = path.last()
      const newParentNodes = parent.nodes.splice(index, 1, a, b)
      const newParent = parent.set('nodes', newParentNodes)
      const newDocument = document.replaceNode(parentPath, newParent)

      const newValue = mapPoints(value.set('document', newDocument), point => {
        if (point.path.equals(path) && position <= point.offset) {
          const newPath = PathUtils.increment(point.path, 1, path.size - 1)
          const newOffset = point.offset - position
          return point.moveTo(newPath, newOffset).setKey(null)
        } else if (
          PathUtils.isAbove(path, point.path) &&
          position <= point.path.get(path.size)
        ) {
          let newPath = PathUtils.increment(point.path, 1, path.size - 1)
          newPath = PathUtils.decrement(newPath, position, path.size)
          return point.setPath(newPath).setKey(null)
        } else if (PathUtils.isYounger(path, point.path)) {
          const newPath = PathUtils.increment(point.path, 1, path.size - 1)
          return point.setPath(newPath).setKey(null)
        } else {
          return point
        }
      })

      return newValue
    }

    default: {
      throw new Error(`Unknown operation type: "${type}".`)
    }
  }
}

function mapRanges(value, iterator) {
  const { document, selection, annotations } = value

  let sel = selection.isSet ? iterator(selection) : selection
  if (!sel) sel = selection.unset()
  if (sel !== selection) sel = document.createSelection(sel)
  value = value.set('selection', sel)

  let anns = annotations.map(annotation => {
    let n = annotation.isSet ? iterator(annotation) : annotation
    if (n && n !== annotation) n = document.createAnnotation(n)
    return n
  })

  anns = anns.filter(annotation => !!annotation)
  value = value.set('annotations', anns)
  return value
}

function mapPoints(value, iterator) {
  return mapRanges(value, range => range.updatePoints(iterator))
}

/**
 * Export.
 *
 * @type {Function}
 */

export default applyOperation
