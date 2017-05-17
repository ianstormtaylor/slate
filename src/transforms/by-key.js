
import Normalize from '../utils/normalize'
import SCHEMA from '../schemas/core'

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.addMarkByKey = (transform, key, offset, length, mark, options = {}) => {
  mark = Normalize.mark(mark)
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.addMarkOperation(path, offset, length, mark)

  if (normalize) {
    const parent = document.getParent(key)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.insertNodeByKey = (transform, key, index, node, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.insertNodeOperation(path, index, node)

  if (normalize) {
    transform.normalizeNodeByKey(key, SCHEMA)
  }
}

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.insertTextByKey = (transform, key, offset, text, marks, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.insertTextOperation(path, offset, text, marks)

  if (normalize) {
    const parent = document.getParent(key)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Join a node by `key` with a node `withKey`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} withKey
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.joinNodeByKey = (transform, key, withKey, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const withPath = document.getPath(withKey)

  transform.joinNodeOperation(path, withPath)

  if (normalize) {
    const parent = document.getCommonAncestor(key, withKey)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
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
 *   @property {Boolean} normalize
 */

Transforms.moveNodeByKey = (transform, key, newKey, newIndex, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)
  const newPath = document.getPath(newKey)

  transform.moveNodeOperation(path, newPath, newIndex)

  if (normalize) {
    const parent = document.getCommonAncestor(key, newKey)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
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
 *   @property {Boolean} normalize
 */

Transforms.removeMarkByKey = (transform, key, offset, length, mark, options = {}) => {
  mark = Normalize.mark(mark)
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.removeMarkOperation(path, offset, length, mark)

  if (normalize) {
    const parent = document.getParent(key)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Remove a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.removeNodeByKey = (transform, key, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.removeNodeOperation(path)

  if (normalize) {
    const parent = document.getParent(key)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.removeTextByKey = (transform, key, offset, length, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.removeTextOperation(path, offset, length)

  if (normalize) {
    const block = document.getClosestBlock(key)
    transform.normalizeNodeByKey(block.key, SCHEMA)
  }
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
 *   @property {Boolean} normalize
 */

Transforms.setMarkByKey = (transform, key, offset, length, mark, properties, options = {}) => {
  mark = Normalize.mark(mark)
  properties = Normalize.markProperties(properties)
  const { normalize = true } = options
  const newMark = mark.merge(properties)
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.setMarkOperation(path, offset, length, mark, newMark)

  if (normalize) {
    const parent = document.getParent(key)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.setNodeByKey = (transform, key, properties, options = {}) => {
  properties = Normalize.nodeProperties(properties)
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.setNodeOperation(path, properties)

  if (normalize) {
    const node = key === document.key ? document : document.getParent(key)
    transform.normalizeNodeByKey(node.key, SCHEMA)
  }
}

/**
 * Split a node by `key` at `offset`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.splitNodeByKey = (transform, key, offset, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const path = document.getPath(key)

  transform.splitNodeAtOffsetOperation(path, offset)

  if (normalize) {
    const parent = document.getParent(key)
    transform.normalizeNodeByKey(parent.key, SCHEMA)
  }
}

/**
 * Unwrap content from an inline parent with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.unwrapInlineByKey = (transform, key, properties, options) => {
  const { state } = transform
  const { document, selection } = state
  const node = document.assertDescendant(key)
  const first = node.getFirstText()
  const last = node.getLastText()
  const range = selection.moveToRangeOf(first, last)
  transform.unwrapInlineAtRange(range, properties, options)
}

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.unwrapBlockByKey = (transform, key, properties, options) => {
  const { state } = transform
  const { document, selection } = state
  const node = document.assertDescendant(key)
  const first = node.getFirstText()
  const last = node.getLastText()
  const range = selection.moveToRangeOf(first, last)
  transform.unwrapBlockAtRange(range, properties, options)
}

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.unwrapNodeByKey = (transform, key, options = {}) => {
  const { normalize = true } = options
  const { state } = transform
  const { document } = state
  const parent = document.getParent(key)
  const node = parent.getChild(key)

  const index = parent.nodes.indexOf(node)
  const isFirst = index === 0
  const isLast = index === parent.nodes.size - 1

  const parentParent = document.getParent(parent.key)
  const parentIndex = parentParent.nodes.indexOf(parent)


  if (parent.nodes.size === 1) {
    transform.moveNodeByKey(key, parentParent.key, parentIndex, { normalize: false })
    transform.removeNodeByKey(parent.key, options)
  }

  else if (isFirst) {
    // Just move the node before its parent.
    transform.moveNodeByKey(key, parentParent.key, parentIndex, options)
  }

  else if (isLast) {
    // Just move the node after its parent.
    transform.moveNodeByKey(key, parentParent.key, parentIndex + 1, options)
  }

  else {
    const parentPath = document.getPath(parent.key)
    // Split the parent.
    transform.splitNodeOperation(parentPath, index)
    // Extract the node in between the splitted parent.
    transform.moveNodeByKey(key, parentParent.key, parentIndex + 1, { normalize: false })

    if (normalize) {
      transform.normalizeNodeByKey(parentParent.key, SCHEMA)
    }
  }
}

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key The node to wrap
 * @param {Block|Object|String} inline The wrapping inline (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.wrapInlineByKey = (transform, key, inline, options) => {
  inline = Normalize.inline(inline)
  inline = inline.set('nodes', inline.nodes.clear())

  const { document } = transform.state
  const node = document.assertDescendant(key)
  const parent = document.getParent(node.key)
  const index = parent.nodes.indexOf(node)

  transform.insertNodeByKey(parent.key, index, inline, { normalize: false })
  transform.moveNodeByKey(node.key, inline.key, 0, options)
}

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key The node to wrap
 * @param {Block|Object|String} block The wrapping block (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Transforms.wrapBlockByKey = (transform, key, block, options) => {
  block = Normalize.block(block)
  block = block.set('nodes', block.nodes.clear())

  const { document } = transform.state
  const node = document.assertDescendant(key)
  const parent = document.getParent(node.key)
  const index = parent.nodes.indexOf(node)

  transform.insertNodeByKey(parent.key, index, block, { normalize: false })
  transform.moveNodeByKey(node.key, block.key, 0, options)
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
