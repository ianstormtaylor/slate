
import Normalize from '../utils/normalize'
import uid from '../utils/uid'

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @return {Transform}
 */

export function addMarkByKey(transform, key, offset, length, mark) {
  mark = Normalize.mark(mark)

  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  const inverse = {
    type: 'remove_mark',
    path,
    offset,
    length,
    mark,
  }

  const operation = {
    type: 'add_mark',
    path,
    offset,
    length,
    mark,
    inverse,
  }

  return transform.operate(operation)
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
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const newPath = path.slice().push(index)

  const inverse = {
    type: 'remove_node',
    path: newPath,
  }

  const operation = {
    type: 'insert_node',
    path,
    index,
    node,
    inverse,
  }

  return transform.operate(operation)
}

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {String} text
 * @param {Set} marks (optional)
 * @return {Transform}
 */

export function insertTextByKey(transform, key, offset, text, marks) {
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  const inverse = {
    type: 'remove_text',
    path,
    offset,
    length: text.length,
  }

  const operation = {
    type: 'insert_text',
    path,
    offset,
    text,
    marks,
  }

  return transform.operate(operation)
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
  const { state } = transform
  const { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(key)
  const parent = document.getParent(key)
  const parentPath = path.slice(0, -1)
  const parentIndex = path[path.length - 1]
  const newPath = document.getPath(newKey)
  const nodePath = newPath.slice().concat([newIndex])

  const inverse = {
    type: 'move_node',
    path: nodePath,
    newPath: parentPath,
    newIndex: parentIndex,
  }

  const operation = {
    type: 'move_node',
    path,
    newPath,
    newIndex,
    inverse,
  }

  return transform.operate(operation)
}

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @return {Transform}
 */

export function removeMarkByKey(transform, key, offset, length, mark) {
  mark = Normalize.mark(mark)

  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  const inverse = {
    type: 'add_mark',
    path,
    offset,
    length,
    mark,
  }

  const operation = {
    type: 'remove_mark',
    path,
    offset,
    length,
    mark,
    inverse,
  }

  return transform.operate(operation)
}

/**
 * Remove a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @return {Transform}
 */

export function removeNodeByKey(transform, key) {
  const { state } = transform
  const { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(key)
  const parentPath = path.slice(0, -1)
  const parentIndex = path.slice(-1)

  const inverse = {
    type: 'insert_node',
    path: parentPath,
    index: parentIndex,
    node,
  }

  const operation = {
    type: 'remove_node',
    path,
    inverse,
  }

  return transform.operate(operation)
}

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @return {Transform}
 */

export function removeTextByKey(transform, key, offset, length) {
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  // TODO!
  const inverse = {}

  const operation = {
    type: 'remove_text',
    path,
    offset,
    length,
    inverse,
  }

  return transform.operate(operation)
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @return {Transform}
 */

export function setMarkByKey(transform, key, offset, length, mark, properties) {
  mark = Normalize.mark(mark)
  properties = Normalize.markProperties(properties)

  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const prevProps = {}

  for (const k in properties) {
    prevProps[k] = mark[k]
  }

  const inverse = {
    type: 'set_mark',
    path,
    offset,
    length,
    mark,
    properties: prevProps,
  }

  const operation = {
    type: 'set_mark',
    path,
    offset,
    length,
    mark,
    properties,
    inverse,
  }

  return transform.operate(operation)
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

  const { state } = transform
  const { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(key)
  const prevProps = {}

  for (const k in properties) {
    prevProps[k] = node[k]
  }

  const inverse = {
    type: 'set_node',
    path,
    properties: prevProps
  }

  const operation = {
    type: 'set_node',
    path,
    properties,
    inverse,
  }

  return transform.operate(operation)
}

/**
 * Split a node by `key` at `offset`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @return {Transform}
 */

export function splitNodeByKey(transform, key, offset) {
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  // TODO!
  const inverse = {}

  const operation = {
    type: 'split_node',
    path,
    offset,
    inverse,
  }

  return transform.operate(operation)
}

