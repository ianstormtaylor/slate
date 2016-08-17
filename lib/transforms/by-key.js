
import Normalize from '../utils/normalize'

/**
 * Add mark to text at `index` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Number} length
 * @param {Mixed} mark
 * @return {Transform}
 */

export function addMarkByKey(transform, key, index, length, mark) {
  mark = Normalize.mark(mark)
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.addMark(index, length, mark)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'add-mark',
    index,
    length,
    mark,
    path,
  })

  return transform
}

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @return {Transform}
 */

export function insertNodeByKey(transform, key, index, node) {
  let { state } = transform
  let { document } = state
  let parent = document.assertDescendant(key)
  const path = document.getPath(parent)
  const nodes = parent.nodes.splice(index + 1, 0, node)

  parent = parent.merge({ nodes })
  document = document.updateDescendant(parent)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'insert-node',
    index,
    node,
    path,
  })

  return transform
}

/**
 * Insert `text` at `index` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {String} text
 * @param {Set} marks (optional)
 * @return {Transform}
 */

export function insertTextByKey(transform, key, index, text, marks) {
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.insertText(index, text, marks)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'insert-text',
    index,
    marks,
    path,
    text,
  })

  return transform
}

/**
 * Move a node by `key` to a new parent by `key` and `index`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} newKey
 * @param {Number} index
 * @return {Transform}
 */

export function moveNodeByKey(transform, key, newKey, newIndex) {
  let { state } = transform
  let { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(node)
  const newPath = document.getPath(newKey)
  let parent = document.getParent(node)
  const isParent = document == parent
  const index = parent.nodes.indexOf(node)

  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)

  let target = document.assertDescendant(newKey)
  const isTarget = document == target

  target = target.insertNode(newIndex, node)
  document = isTarget ? target : document.updateDescendant(target)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'move-node',
    path,
    newPath,
    newIndex,
  })

  return transform
}

/**
 * Remove mark from text at `index` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Number} length
 * @param {Mark} mark
 * @return {Transform}
 */

export function removeMarkByKey(transform, key, index, length, mark) {
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.removeMark(index, length, mark)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'remove-mark',
    index,
    length,
    mark,
    path,
  })

  return transform
}

/**
 * Remove a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @return {Transform}
 */

export function removeNodeByKey(transform, key) {
  let { state } = transform
  let { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(node)
  let parent = document.getParent(node)
  const index = parent.nodes.indexOf(node)
  const isParent = document == parent

  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'remove-node',
    path,
  })

  return transform
}

/**
 * Remove text at `index` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Number} length
 * @return {Transform}
 */

export function removeTextByKey(transform, key, index, length) {
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.removeText(index, length)
  document = document.updateDescendant(node)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'remove-text',
    index,
    length,
    path,
  })

  return transform
}

/**
 * Set `properties` on mark on text at `index` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Number} length
 * @param {Mark} mark
 * @return {Transform}
 */

export function setMarkByKey(transform, key, index, length, mark, properties) {
  properties = Normalize.markProperties(properties)
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.updateMark(index, length, mark, properties)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'set-mark',
    index,
    length,
    mark,
    path,
    properties,
  })

  return transform
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object || String} properties
 * @return {Transform}
 */

export function setNodeByKey(transform, key, properties) {
  properties = Normalize.nodeProperties(properties)
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.merge(properties)
  document = document.updateDescendant(node)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'set-node',
    path,
    properties,
  })

  return transform
}
