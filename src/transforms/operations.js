
import Normalize from '../utils/normalize'

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Add mark to text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 */

Transforms.addMarkOperation = (transform, path, offset, length, mark) => {
  const inverse = [{
    type: 'remove_mark',
    path,
    offset,
    length,
    mark,
  }]

  const operation = {
    type: 'add_mark',
    path,
    offset,
    length,
    mark,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Insert a `node` at `index` in a node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} index
 * @param {Node} node
 */

Transforms.insertNodeOperation = (transform, path, index, node) => {
  const inversePath = path.slice().concat([index])
  const inverse = [{
    type: 'remove_node',
    path: inversePath,
  }]

  const operation = {
    type: 'insert_node',
    path,
    index,
    node,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Transforms.insertTextOperation = (transform, path, offset, text, marks) => {
  const inverseLength = text.length
  const inverse = [{
    type: 'remove_text',
    path,
    offset,
    length: inverseLength,
  }]

  const operation = {
    type: 'insert_text',
    path,
    offset,
    text,
    marks,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Join a node by `path` with a node `withPath`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Array} withPath
 */

Transforms.joinNodeOperation = (transform, path, withPath) => {
  const { state } = transform
  const { document } = state
  const node = document.assertPath(withPath)

  let inverse
  if (node.kind === 'text') {
    const offset = node.length

    inverse = [{
      type: 'split_node',
      path: withPath,
      offset,
    }]
  } else {
    // The number of children after which we split
    const count = node.nodes.count()

    inverse = [{
      type: 'split_node',
      path: withPath,
      count,
    }]
  }

  const operation = {
    type: 'join_node',
    path,
    withPath,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Move a node by `path` to a `newPath` and `newIndex`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Array} newPath
 * @param {Number} newIndex
 */

Transforms.moveNodeOperation = (transform, path, newPath, newIndex) => {
  const parentPath = path.slice(0, -1)
  const parentIndex = path[path.length - 1]
  const inversePath = newPath.slice().concat([newIndex])

  const inverse = [{
    type: 'move_node',
    path: inversePath,
    newPath: parentPath,
    newIndex: parentIndex,
  }]

  const operation = {
    type: 'move_node',
    path,
    newPath,
    newIndex,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Remove mark from text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 */

Transforms.removeMarkOperation = (transform, path, offset, length, mark) => {
  const inverse = [{
    type: 'add_mark',
    path,
    offset,
    length,
    mark,
  }]

  const operation = {
    type: 'remove_mark',
    path,
    offset,
    length,
    mark,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Remove a node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 */

Transforms.removeNodeOperation = (transform, path) => {
  const { state } = transform
  const { document } = state
  const node = document.assertPath(path)
  const inversePath = path.slice(0, -1)
  const inverseIndex = path[path.length - 1]

  const inverse = [{
    type: 'insert_node',
    path: inversePath,
    index: inverseIndex,
    node,
  }]

  const operation = {
    type: 'remove_node',
    path,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Remove text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 */

Transforms.removeTextOperation = (transform, path, offset, length) => {
  const { state } = transform
  const { document } = state
  const node = document.assertPath(path)
  const ranges = node.getRanges()
  const inverse = []

  // Loop the ranges of text in the node, creating inverse insert operations for
  // each of the ranges that overlap with the remove operation. This is
  // necessary because insert's can only have a single set of marks associated
  // with them, but removes can remove many.
  ranges.reduce((start, range) => {
    const { text, marks } = range
    const end = start + text.length
    if (start > offset + length) return end
    if (end <= offset) return end

    const endOffset = Math.min(end, offset + length)
    const string = text.slice(offset - start, endOffset - start)

    inverse.push({
      type: 'insert_text',
      path,
      offset,
      text: string,
      marks,
    })

    return end
  }, 0)

  const operation = {
    type: 'remove_text',
    path,
    offset,
    length,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Merge `properties` into state `data`.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

Transforms.setDataOperation = (transform, properties) => {
  const { state } = transform
  const { data } = state
  const inverseProps = {}

  for (const k in properties) {
    inverseProps[k] = data[k]
  }

  const inverse = [{
    type: 'set_data',
    properties: inverseProps
  }]

  const operation = {
    type: 'set_data',
    properties,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Mark} newMark
 */

Transforms.setMarkOperation = (transform, path, offset, length, mark, newMark) => {
  const inverse = [{
    type: 'set_mark',
    path,
    offset,
    length,
    mark: newMark,
    newMark: mark
  }]

  const operation = {
    type: 'set_mark',
    path,
    offset,
    length,
    mark,
    newMark,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Set `properties` on a node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Object} properties
 */

Transforms.setNodeOperation = (transform, path, properties) => {
  const { state } = transform
  const { document } = state
  const node = document.assertPath(path)
  const inverseProps = {}

  for (const k in properties) {
    inverseProps[k] = node[k]
  }

  const inverse = [{
    type: 'set_node',
    path,
    properties: inverseProps
  }]

  const operation = {
    type: 'set_node',
    path,
    properties,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Set the selection to a new `selection`.
 *
 * @param {Transform} transform
 * @param {Mixed} selection
 */

Transforms.setSelectionOperation = (transform, properties, options = {}) => {
  properties = Normalize.selectionProperties(properties)

  const { state } = transform
  const { document, selection } = state
  const prevProps = {}
  const props = {}

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (const k in properties) {
    if (!options.snapshot && properties[k] == selection[k]) continue
    props[k] = properties[k]
    prevProps[k] = selection[k]
  }

  // If the selection moves, clear any marks, unless the new selection
  // does change the marks in some way
  const moved = [
    'anchorKey',
    'anchorOffset',
    'focusKey',
    'focusOffset',
  ].some(p => props.hasOwnProperty(p))

  if (
    selection.marks &&
    properties.marks == selection.marks &&
    moved
  ) {
    props.marks = null
  }

  // Resolve the selection keys into paths.
  if (props.anchorKey) {
    props.anchorPath = document.getPath(props.anchorKey)
    delete props.anchorKey
  }

  if (prevProps.anchorKey) {
    prevProps.anchorPath = document.getPath(prevProps.anchorKey)
    delete prevProps.anchorKey
  }

  if (props.focusKey) {
    props.focusPath = document.getPath(props.focusKey)
    delete props.focusKey
  }

  if (prevProps.focusKey) {
    prevProps.focusPath = document.getPath(prevProps.focusKey)
    delete prevProps.focusKey
  }

  // Define an inverse of the operation for undoing.
  const inverse = [{
    type: 'set_selection',
    properties: prevProps
  }]

  // Define the operation.
  const operation = {
    type: 'set_selection',
    properties: props,
    inverse,
  }

  // Apply the operation.
  transform.applyOperation(operation)
}

/**
 * Split a node by `path` at `offset`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 */

Transforms.splitNodeAtOffsetOperation = (transform, path, offset) => {
  const inversePath = path.slice()
  inversePath[path.length - 1] += 1

  const inverse = [{
    type: 'join_node',
    path: inversePath,
    withPath: path,
    // We will split down to the text nodes, so we must join nodes recursively.
    deep: true
  }]

  const operation = {
    type: 'split_node',
    path,
    offset,
    count: null,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Split a node by `path` after its 'count' child.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} count
 */

Transforms.splitNodeOperation = (transform, path, count) => {
  const inversePath = path.slice()
  inversePath[path.length - 1] += 1

  const inverse = [{
    type: 'join_node',
    path: inversePath,
    withPath: path,
    deep: false
  }]

  const operation = {
    type: 'split_node',
    path,
    offset: null,
    count,
    inverse,
  }

  transform.applyOperation(operation)
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
