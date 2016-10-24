import Normalize from '../utils/normalize'

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function addMarkByKey(transform, key, offset, length, mark, options = {}) {
  const { normalize = true } = options
  mark = Normalize.mark(mark)
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.addMarkOperation(path, offset, length, mark)
  if (normalize) {
    transform = transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function insertNodeByKey(transform, key, index, node, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform = transform.insertNodeOperation(path, index, node)
  if (normalize) {
    transform = transform.normalizeNodeByKey(key)
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
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function insertTextByKey(transform, key, offset, text, marks, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.insertTextOperation(path, offset, text, marks)
  if (normalize) {
    transform = transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Join a node by `key` with a node `withKey`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} withKey
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function joinNodeByKey(transform, key, withKey, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const withPath = document.getPath(withKey)
  const parent = document.getCommonAncestor(key, withKey)

  transform = transform.joinNodeOperation(path, withPath)

  if (normalize) {
    if (parent) {
      transform = transform.normalizeNodeByKey(parent.key)
    } else {
      transform = transform.normalizeDocument()
    }
  }

  return transform
}

/**
 * Move a node by `key` to a new parent by `newKey` and `index`.
 * `newKey` is the key of the container (it can be the document itself)
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} newKey
 * @param {Number} index
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function moveNodeByKey(transform, key, newKey, newIndex, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const newPath = document.getPath(newKey)
  const parent = document.key == newKey ? null : document.getCommonAncestor(key, newKey)

  transform = transform.moveNodeOperation(path, newPath, newIndex)

  if (normalize) {
    transform = transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function removeMarkByKey(transform, key, offset, length, mark, options = {}) {
  const { normalize = true } = options
  mark = Normalize.mark(mark)
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.removeMarkOperation(path, offset, length, mark)
  if (normalize) {
    transform = transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Remove a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function removeNodeByKey(transform, key, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  let { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.removeNodeOperation(path)

  if (normalize) {
    if (parent) {
      transform = transform.normalizeNodeByKey(parent.key)
    } else {
      transform = transform.normalizeDocument()
    }
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
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function removeTextByKey(transform, key, offset, length, options = {}) {
  const { normalize = true } = options
  const { state } = transform
  let { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.removeTextOperation(path, offset, length)
  if (normalize) {
    transform = transform.normalizeParentsByKey(parent.key)
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
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function setMarkByKey(transform, key, offset, length, mark, properties, options = {}) {
  const { normalize = true } = options
  mark = Normalize.mark(mark)
  properties = Normalize.markProperties(properties)
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.setMarkOperation(path, offset, length, mark, properties)
  if (normalize) {
    transform = transform.normalizeNodeByKey(parent.key)
  }

  return transform
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object || String} properties
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function setNodeByKey(transform, key, properties, options = {}) {
  const { normalize = true } = options
  properties = Normalize.nodeProperties(properties)
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.setNodeOperation(path, properties)

  if (normalize) {
    if (parent) {
      transform = transform.normalizeNodeByKey(parent.key)
    } else {
      transform = transform.normalizeDocument()
    }
  }

  return transform
}

/**
 * Split a node by `key` at `offset`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Object} options
 *   @param {Boolean} normalize
 * @return {Transform}
 */

export function splitNodeByKey(transform, key, offset, options = {}) {
  const { normalize = true } = options
  let { state } = transform
  let { document } = state
  const path = document.getPath(key)
  const parent = document.getParent(key)

  transform = transform.splitNodeOperation(path, offset)

  if (normalize) {
    if (parent) {
      transform = transform.normalizeNodeByKey(parent.key)
    } else {
      transform = transform.normalizeDocument()
    }
  }

  return transform
}
