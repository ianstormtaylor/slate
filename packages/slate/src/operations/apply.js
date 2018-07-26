import Debug from 'debug'

import Operation from '../models/operation'
import PathUtils from '../utils/path-utils'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation:apply')

/**
 * Map all range objects to apply adjustments with an `iterator`.
 *
 * @param {Value} value
 * @param {Function} iterator
 * @return {Value}
 */

function mapRanges(value, iterator) {
  const { document, selection, decorations } = value

  if (selection) {
    let next = selection.isSet ? iterator(selection) : selection
    if (!next) next = selection.deselect()
    if (next !== selection) next = next.normalize(document)
    value = value.set('selection', next)
  }

  if (decorations) {
    let next = decorations.map(decoration => {
      let n = decoration.isSet ? iterator(decoration) : decoration
      if (n && n !== decoration) n = n.normalize(document)
      return n
    })

    next = next.filter(decoration => !!decoration)
    next = next.size ? next : null
    value = value.set('decorations', next)
  }

  return value
}

/**
 * Remove any atomic ranges inside a `key`, `offset` and `length`.
 *
 * @param {Value} value
 * @param {String} key
 * @param {Number} start
 * @param {Number?} end
 * @return {Value}
 */

function clearAtomicRanges(value, key, start, end = null) {
  return mapRanges(value, range => {
    const { isAtomic, startKey, startOffset, endKey, endOffset } = range
    if (!isAtomic) return range
    if (startKey !== key) return range

    if (startOffset < start && (endKey !== key || endOffset > start)) {
      return null
    }

    if (
      end != null &&
      startOffset < end &&
      (endKey !== key || endOffset > end)
    ) {
      return null
    }

    return range
  })
}

/**
 * Applying functions.
 *
 * @type {Object}
 */

const APPLIERS = {
  /**
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  add_mark(value, operation) {
    const { path, offset, length, mark } = operation
    let { document } = value
    let node = document.assertNode(path)
    node = node.addMark(offset, length, mark)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Insert a `node` at `index` in a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  insert_node(value, operation) {
    const { path, node } = operation
    const index = PathUtils.getIndex(path)
    const parentPath = PathUtils.getParent(path)
    let { document } = value
    let parent = document.assertNode(parentPath)
    parent = parent.insertNode(index, node)
    document = document.updateNode(parent)
    value = value.set('document', document)

    value = mapRanges(value, range => {
      return range.merge({ anchorPath: null, focusPath: null })
    })

    return value
  },

  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  insert_text(value, operation) {
    const { path, offset, text, marks } = operation
    let { document } = value
    let node = document.assertNode(path)
    node = node.insertText(offset, text, marks)
    document = document.updateNode(node)
    value = value.set('document', document)

    // Update any ranges that were affected.
    value = clearAtomicRanges(value, node.key, offset)

    value = mapRanges(value, range => {
      const { anchorKey, anchorOffset, isBackward, isAtomic } = range

      if (
        anchorKey === node.key &&
        (anchorOffset > offset ||
          (anchorOffset === offset && (!isAtomic || !isBackward)))
      ) {
        return range.moveAnchor(text.length)
      }

      return range
    })

    value = mapRanges(value, range => {
      const { focusKey, focusOffset, isBackward, isAtomic } = range

      if (
        focusKey === node.key &&
        (focusOffset > offset ||
          (focusOffset == offset && (!isAtomic || isBackward)))
      ) {
        return range.moveFocus(text.length)
      }

      return range
    })

    return value
  },

  /**
   * Merge a node at `path` with the previous node.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  merge_node(value, operation) {
    const { path } = operation
    const withPath = PathUtils.decrement(path)
    let { document } = value
    const one = document.assertNode(withPath)
    const two = document.assertNode(path)
    let parent = document.getParentByPath(path)
    const oneIndex = PathUtils.getIndex(withPath)
    const twoIndex = PathUtils.getIndex(path)

    // Perform the merge in the document.
    parent = parent.mergeNode(oneIndex, twoIndex)
    document = document.updateNode(parent)
    value = value.set('document', document)

    value = mapRanges(value, range => {
      if (two.object === 'text') {
        const max = one.text.length

        if (range.anchorKey === two.key) {
          range = range.moveAnchorTo(one.key, max + range.anchorOffset)
        }

        if (range.focusKey === two.key) {
          range = range.moveFocusTo(one.key, max + range.focusOffset)
        }
      }

      range = range.merge({ anchorPath: null, focusPath: null })
      return range
    })

    return value
  },

  /**
   * Move a node by `path` to `newPath`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  move_node(value, operation) {
    const { path, newPath } = operation
    const newIndex = PathUtils.getIndex(newPath)
    let newParentPath = PathUtils.getParent(newPath)
    const oldParentPath = PathUtils.getParent(path)
    const oldIndex = PathUtils.getIndex(path)
    let { document } = value
    const node = document.assertNode(path)

    // Remove the node from its current parent.
    let parent = document.getParentByPath(path)
    parent = parent.removeNode(oldIndex)
    document = document.updateNode(parent)

    // Find the new target...
    let target

    // If the old path and the rest of the new path are the same, then the new
    // target is the old parent.
    if (
      oldParentPath.every((x, i) => x === newParentPath.get(i)) &&
      oldParentPath.size === newParentPath.size
    ) {
      target = parent
    } else if (
      oldParentPath.every((x, i) => x === newParentPath.get(i)) &&
      oldIndex < newParentPath.get(oldParentPath.size)
    ) {
      newParentPath = PathUtils.decrement(newParentPath, 1, oldParentPath.size)
      target = document.assertNode(newParentPath)
    } else {
      // Otherwise, we can just grab the target normally...
      target = document.assertNode(newParentPath)
    }

    // Insert the new node to its new parent.
    target = target.insertNode(newIndex, node)
    document = document.updateNode(target)
    value = value.set('document', document)

    value = mapRanges(value, range => {
      return range.merge({ anchorPath: null, focusPath: null })
    })

    return value
  },

  /**
   * Remove mark from text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_mark(value, operation) {
    const { path, offset, length, mark } = operation
    let { document } = value
    let node = document.assertNode(path)
    node = node.removeMark(offset, length, mark)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Remove a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_node(value, operation) {
    const { path } = operation
    let { document } = value
    const node = document.assertNode(path)
    const first = node.object == 'text' ? node : node.getFirstText() || node
    const last = node.object == 'text' ? node : node.getLastText() || node
    const prev = document.getPreviousText(first.key)
    const next = document.getNextText(last.key)

    // Remove the node from the document.
    let parent = document.getParent(node.key)
    const index = parent.nodes.indexOf(node)
    parent = parent.removeNode(index)
    document = document.updateNode(parent)
    value = value.set('document', document)

    // Update the ranges in case they referenced the removed node.
    value = mapRanges(value, range => {
      const { startKey, endKey } = range
      if (node.hasNode(startKey)) {
        range = prev
          ? range.moveStartTo(prev.key, prev.text.length)
          : next ? range.moveStartTo(next.key, 0) : range.deselect()
      }

      if (node.hasNode(endKey)) {
        range = prev
          ? range.moveEndTo(prev.key, prev.text.length)
          : next ? range.moveEndTo(next.key, 0) : range.deselect()
      }

      range = range.merge({ anchorPath: null, focusPath: null })
      return range
    })

    return value
  },

  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_text(value, operation) {
    const { path, offset, text } = operation
    const { length } = text
    const rangeOffset = offset + length
    let { document } = value

    // Remove the text from the node and update the document.
    let node = document.assertNode(path)
    node = node.removeText(offset, length)
    document = document.updateNode(node)
    value = value.set('document', document)

    // Update any rnages that might be affected.
    value = clearAtomicRanges(value, node.key, offset, offset + length)

    value = mapRanges(value, range => {
      const { anchorKey } = range

      if (anchorKey === node.key) {
        return range.anchorOffset >= rangeOffset
          ? range.moveAnchor(-length)
          : range.anchorOffset > offset
            ? range.moveAnchorTo(range.anchorKey, offset)
            : range
      }

      return range
    })

    value = mapRanges(value, range => {
      const { focusKey } = range

      if (focusKey === node.key) {
        return range.focusOffset >= rangeOffset
          ? range.moveFocus(-length)
          : range.focusOffset > offset
            ? range.moveFocusTo(range.focusKey, offset)
            : range
      }

      return range
    })

    return value
  },

  /**
   * Set `properties` on mark on text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_mark(value, operation) {
    const { path, offset, length, mark, properties } = operation
    let { document } = value
    let node = document.assertNode(path)
    node = node.updateMark(offset, length, mark, properties)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Set `properties` on a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_node(value, operation) {
    const { path, properties } = operation
    let { document } = value
    let node = document.assertNode(path)
    node = node.merge(properties)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Set `properties` on the selection.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_selection(value, operation) {
    const { properties } = operation
    let { document, selection } = value
    selection = selection.merge(properties)
    selection = selection.normalize(document)
    value = value.set('selection', selection)
    return value
  },

  /**
   * Set `properties` on `value`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_value(value, operation) {
    const { properties } = operation
    value = value.merge(properties)
    return value
  },

  /**
   * Split a node by `path` at `offset`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  split_node(value, operation) {
    const { path, position, properties } = operation
    let { document } = value

    // Split the node by its parent.
    const node = document.assertNode(path)
    const index = path.last()
    let parent = document.getParentByPath(path)
    parent = parent.splitNode(index, position)

    // Update the properties on the new node if needed.
    if (properties && node.object !== 'text') {
      const newNode = parent.nodes.get(index + 1)
      parent = parent.updateNode(newNode.merge(properties))
    }

    // Update the node in the document.
    document = document.updateNode(parent)
    value = value.set('document', document)

    // Update any ranges that were affected.
    value = mapRanges(value, range => {
      const next = document.getNextText(node.key)
      const { startKey, startOffset, endKey, endOffset } = range

      // If the start was after the split, move it to the next node.
      if (node.key === startKey && position <= startOffset) {
        range = range.moveStartTo(next.key, startOffset - position)
      }

      // If the end was after the split, move it to the next node.
      if (node.key === endKey && position <= endOffset) {
        range = range.moveEndTo(next.key, endOffset - position)
      }

      range = range.merge({ anchorPath: null, focusPath: null })
      return range
    })

    return value
  },
}

/**
 * Apply an `operation` to a `value`.
 *
 * @param {Value} value
 * @param {Object|Operation} operation
 * @return {Value} value
 */

function applyOperation(value, operation) {
  operation = Operation.create(operation)
  const { type } = operation
  const apply = APPLIERS[type]

  if (!apply) {
    throw new Error(`Unknown operation type: "${type}".`)
  }

  debug(type, operation)
  value = apply(value, operation)
  return value
}

/**
 * Export.
 *
 * @type {Function}
 */

export default applyOperation
