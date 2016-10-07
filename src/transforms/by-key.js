
import Text from '../models/text'
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
  return transform.addMarkOperation(path, offset, length, mark)
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

  transform.insertNodeOperation(path, index, node)

  // If the node is an inline void, the parent is a block, and the node will be
  // inserted at the block's edge, we need to add surrounding text nodes.
  if (node.kind == 'inline' && node.isVoid) {
    const parent = document.assertDescendant(key)

    if (index == 0) {
      const text = Text.create()
      transform.insertNodeByKey(key, index, text)
    }

    if (index == parent.nodes.size) {
      const text = Text.create()
      transform.insertNodeByKey(key, index + 1, text)
    }
  }

  return transform
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
  return transform.insertTextOperation(path, offset, text, marks)
}

/**
 * Join a node by `key` with a node `withKey`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} withKey
 * @return {Transform}
 */

export function joinNodeByKey(transform, key, withKey) {
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const withPath = document.getPath(withKey)
  return transform.joinNodeOperation(path, withPath)
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
  const path = document.getPath(key)
  const newPath = document.getPath(newKey)
  return transform.moveNodeOperation(path, newPath, newIndex)
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
  return transform.removeMarkOperation(path, offset, length, mark)
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
  let { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(key)
  const parent = document.getParent(key)
  const previous = document.getPreviousSibling(key)
  const next = document.getNextSibling(key)
  transform.removeNodeOperation(path)

  // If there are no more remaining nodes in the parent, re-add an empty text
  // node so that we guarantee to always have text nodes as the tree's leaves.
  if (parent.nodes.size == 1) {
    const text = Text.create()
    transform.insertNodeByKey(parent.key, 0, text)
  }

  // If the previous and next siblings are both text nodes, join them.
  if (
    (previous && previous.kind == 'text') &&
    (next && next.kind == 'text')
  ) {
    transform.joinNodeByKey(next.key, previous.key)
  }

  return transform
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
  let { document } = state
  const path = document.getPath(key)
  transform.removeTextOperation(path, offset, length)

  // If the text node is now empty, we might need to remove more nodes.
  document = transform.state.document
  const node = document.getDescendant(key)
  const parent = document.getParent(key)
  const previous = document.getPreviousSibling(key)
  const next = document.getNextSibling(key)

  // If the text node isn't empty, don't do anything more.
  if (node.text != '') {
    return transform
  }

  // If the empty text node is the only node remaining in a non-void inline,
  // remove the inline completely.
  if (
    parent.kind == 'inline' &&
    parent.isVoid == false &&
    parent.nodes.size == 1
  ) {
    transform.removeNodeByKey(parent.key)
  }

  // Otherwise, if the text node is not needed in the tree any more, remove it.
  else if (
    (previous && previous.isVoid == false) ||
    (next && next.isVoid == false)
  ) {
    transform.removeNodeByKey(key)
  }

  return transform
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
  return transform.setMarkOperation(path, offset, length, mark, properties)
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
  return transform.setNodeOperation(path, properties)
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
  return transform.splitNodeOperation(path, offset)
}
