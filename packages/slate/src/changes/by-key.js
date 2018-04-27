import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import Range from '../models/range'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.addMarkByKey = (change, key, offset, length, mark, options = {}) => {
  mark = Mark.create(mark)
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const node = document.getNode(key)
  const leaves = node.getLeaves()

  const operations = []
  const bx = offset
  const by = offset + length
  let o = 0

  leaves.forEach(leaf => {
    const ax = o
    const ay = ax + leaf.text.length

    o += leaf.text.length

    // If the leaf doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return

    // If the leaf already has the mark, continue on.
    if (leaf.marks.has(mark)) return

    // Otherwise, determine which offset and characters overlap.
    const start = Math.max(ax, bx)
    const end = Math.min(ay, by)

    operations.push({
      type: 'add_mark',
      value,
      path,
      offset: start,
      length: end - start,
      mark,
    })
  })

  change.applyOperations(operations)

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Insert a `fragment` at `index` in a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} index
 * @param {Fragment} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertFragmentByKey = (change, key, index, fragment, options = {}) => {
  const normalize = change.getFlag('normalize', options)

  fragment.nodes.forEach((node, i) => {
    change.insertNodeByKey(key, index + i, node)
  })

  if (normalize) {
    change.normalizeNodeByKey(key)
  }
}

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertNodeByKey = (change, key, index, node, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)

  change.applyOperation({
    type: 'insert_node',
    value,
    path: [...path, index],
    node,
  })

  if (normalize) {
    change.normalizeNodeByKey(key)
  }
}

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertTextByKey = (change, key, offset, text, marks, options = {}) => {
  const normalize = change.getFlag('normalize', options)

  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const node = document.getNode(key)
  marks = marks || node.getMarksAtIndex(offset)

  change.applyOperation({
    type: 'insert_text',
    value,
    path,
    offset,
    text,
    marks,
  })

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Merge a node by `key` with the previous node.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.mergeNodeByKey = (change, key, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const original = document.getDescendant(key)
  const previous = document.getPreviousSibling(key)

  if (!previous) {
    throw new Error(`Unable to merge node with key "${key}", no previous key.`)
  }

  const position =
    previous.object == 'text' ? previous.text.length : previous.nodes.size

  change.applyOperation({
    type: 'merge_node',
    value,
    path,
    position,
    // for undos to succeed we only need the type and data because
    // these are the only properties that get changed in the merge operation
    properties: {
      type: original.type,
      data: original.data,
    },
    target: null,
  })

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Move a node by `key` to a new parent by `newKey` and `index`.
 * `newKey` is the key of the container (it can be the document itself)
 *
 * @param {Change} change
 * @param {String} key
 * @param {String} newKey
 * @param {Number} index
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.moveNodeByKey = (change, key, newKey, newIndex, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const newPath = document.getPath(newKey)

  change.applyOperation({
    type: 'move_node',
    value,
    path,
    newPath: [...newPath, newIndex],
  })

  if (normalize) {
    const parent = document.getCommonAncestor(key, newKey)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeMarkByKey = (change, key, offset, length, mark, options = {}) => {
  mark = Mark.create(mark)
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const node = document.getNode(key)
  const leaves = node.getLeaves()

  const operations = []
  const bx = offset
  const by = offset + length
  let o = 0

  leaves.forEach(leaf => {
    const ax = o
    const ay = ax + leaf.text.length

    o += leaf.text.length

    // If the leaf doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return

    // If the leaf already has the mark, continue on.
    if (!leaf.marks.has(mark)) return

    // Otherwise, determine which offset and characters overlap.
    const start = Math.max(ax, bx)
    const end = Math.min(ay, by)

    operations.push({
      type: 'remove_mark',
      value,
      path,
      offset: start,
      length: end - start,
      mark,
    })
  })

  change.applyOperations(operations)

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Remove all `marks` from node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeAllMarksByKey = (change, key, options = {}) => {
  const { state } = change
  const { document } = state
  const node = document.getNode(key)
  const texts = node.object === 'text' ? [node] : node.getTextsAsArray()

  texts.forEach(text => {
    text.getMarksAsArray().forEach(mark => {
      change.removeMarkByKey(text.key, 0, text.text.length, mark, options)
    })
  })
}

/**
 * Remove a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeNodeByKey = (change, key, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const node = document.getNode(key)

  change.applyOperation({
    type: 'remove_node',
    value,
    path,
    node,
  })

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setTextByKey = (change, key, text, marks, options = {}) => {
  const textNode = change.value.document.getDescendant(key)
  change.replaceTextByKey(key, 0, textNode.text.length, text, marks, options)
}

/**
 * Replace A Length of Text with another string or text
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {string} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 *
 */

Changes.replaceTextByKey = (
  change,
  key,
  offset,
  length,
  text,
  marks,
  options
) => {
  const { document } = change.value
  const textNode = document.getDescendant(key)
  if (length + offset > textNode.text.length) {
    length = textNode.text.length - offset
  }
  const range = Range.create({
    anchorKey: key,
    focusKey: key,
    anchorOffset: offset,
    focusOffset: offset + length,
  })
  let activeMarks = document.getActiveMarksAtRange(range)

  change.removeTextByKey(key, offset, length, { normalize: false })
  if (!marks) {
    // Do not use mark at index when marks and activeMarks are both empty
    marks = activeMarks ? activeMarks : []
  } else if (activeMarks) {
    // Do not use `has` because we may want to reset marks like font-size with an updated data;
    activeMarks = activeMarks.filter(
      activeMark => !marks.find(m => activeMark.type === m.type)
    )
    marks = activeMarks.merge(marks)
  }
  change.insertTextByKey(key, offset, text, marks, options)
}

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeTextByKey = (change, key, offset, length, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const node = document.getNode(key)
  const leaves = node.getLeaves()
  const { text } = node

  const removals = []
  const bx = offset
  const by = offset + length
  let o = 0

  leaves.forEach(leaf => {
    const ax = o
    const ay = ax + leaf.text.length

    o += leaf.text.length

    // If the leaf doesn't overlap with the removal, continue on.
    if (ay < bx || by < ax) return

    // Otherwise, determine which offset and characters overlap.
    const start = Math.max(ax, bx)
    const end = Math.min(ay, by)
    const string = text.slice(start, end)

    removals.push({
      type: 'remove_text',
      value,
      path,
      offset: start,
      text: string,
      marks: leaf.marks,
    })
  })

  // Apply in reverse order, so subsequent removals don't impact previous ones.
  change.applyOperations(removals.reverse())

  if (normalize) {
    const block = document.getClosestBlock(key)
    change.normalizeNodeByKey(block.key)
  }
}

/**
`* Replace a `node` with another `node`
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|Node} node
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.replaceNodeByKey = (change, key, newNode, options = {}) => {
  newNode = Node.create(newNode)
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const node = document.getNode(key)
  const parent = document.getParent(key)
  const index = parent.nodes.indexOf(node)
  change.removeNodeByKey(key, { normalize: false })
  change.insertNodeByKey(parent.key, index, newNode, { normalize: false })
  if (normalize) {
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setMarkByKey = (
  change,
  key,
  offset,
  length,
  mark,
  properties,
  options = {}
) => {
  mark = Mark.create(mark)
  properties = Mark.createProperties(properties)
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)

  change.applyOperation({
    type: 'set_mark',
    value,
    path,
    offset,
    length,
    mark,
    properties,
  })

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setNodeByKey = (change, key, properties, options = {}) => {
  properties = Node.createProperties(properties)
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const node = document.getNode(key)

  change.applyOperation({
    type: 'set_node',
    value,
    path,
    node,
    properties,
  })

  if (normalize) {
    change.normalizeNodeByKey(node.key)
  }
}

/**
 * Split a node by `key` at `position`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} position
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitNodeByKey = (change, key, position, options = {}) => {
  const { normalize = true, target = null } = options
  const { value } = change
  const { document } = value
  const path = document.getPath(key)
  const node = document.getDescendantAtPath(path)

  change.applyOperation({
    type: 'split_node',
    value,
    path,
    position,
    properties: {
      type: node.type,
      data: node.data,
    },
    target,
  })

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Split a node deeply down the tree by `key`, `textKey` and `textOffset`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} position
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitDescendantsByKey = (
  change,
  key,
  textKey,
  textOffset,
  options = {}
) => {
  if (key == textKey) {
    change.splitNodeByKey(textKey, textOffset, options)
    return
  }

  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value

  const text = document.getNode(textKey)
  const ancestors = document.getAncestors(textKey)
  const nodes = ancestors
    .skipUntil(a => a.key == key)
    .reverse()
    .unshift(text)
  let previous
  let index

  nodes.forEach(node => {
    const prevIndex = index == null ? null : index
    index = previous ? node.nodes.indexOf(previous) + 1 : textOffset
    previous = node
    change.splitNodeByKey(node.key, index, {
      normalize: false,
      target: prevIndex,
    })
  })

  if (normalize) {
    const parent = document.getParent(key)
    change.normalizeNodeByKey(parent.key)
  }
}

/**
 * Unwrap content from an inline parent with `properties`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapInlineByKey = (change, key, properties, options) => {
  const { value } = change
  const { document, selection } = value
  const node = document.assertDescendant(key)
  const first = node.getFirstText()
  const last = node.getLastText()
  const range = selection.moveToRangeOf(first, last)
  change.unwrapInlineAtRange(range, properties, options)
}

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapBlockByKey = (change, key, properties, options) => {
  const { value } = change
  const { document, selection } = value
  const node = document.assertDescendant(key)
  const first = node.getFirstText()
  const last = node.getLastText()
  const range = selection.moveToRangeOf(first, last)
  change.unwrapBlockAtRange(range, properties, options)
}

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapNodeByKey = (change, key, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  const { value } = change
  const { document } = value
  const parent = document.getParent(key)
  const node = parent.getChild(key)

  const index = parent.nodes.indexOf(node)
  const isFirst = index === 0
  const isLast = index === parent.nodes.size - 1

  const parentParent = document.getParent(parent.key)
  const parentIndex = parentParent.nodes.indexOf(parent)

  if (parent.nodes.size === 1) {
    change.moveNodeByKey(key, parentParent.key, parentIndex, {
      normalize: false,
    })
    change.removeNodeByKey(parent.key, options)
  } else if (isFirst) {
    // Just move the node before its parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex, options)
  } else if (isLast) {
    // Just move the node after its parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex + 1, options)
  } else {
    // Split the parent.
    change.splitNodeByKey(parent.key, index, { normalize: false })

    // Extract the node in between the splitted parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex + 1, {
      normalize: false,
    })

    if (normalize) {
      change.normalizeNodeByKey(parentParent.key)
    }
  }
}

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Change} change
 * @param {String} key The node to wrap
 * @param {Block|Object|String} block The wrapping block (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapBlockByKey = (change, key, block, options) => {
  block = Block.create(block)
  block = block.set('nodes', block.nodes.clear())

  const { document } = change.value
  const node = document.assertDescendant(key)
  const parent = document.getParent(node.key)
  const index = parent.nodes.indexOf(node)

  change.insertNodeByKey(parent.key, index, block, { normalize: false })
  change.moveNodeByKey(node.key, block.key, 0, options)
}

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Change} change
 * @param {String} key The node to wrap
 * @param {Block|Object|String} inline The wrapping inline (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapInlineByKey = (change, key, inline, options) => {
  inline = Inline.create(inline)
  inline = inline.set('nodes', inline.nodes.clear())

  const { document } = change.value
  const node = document.assertDescendant(key)
  const parent = document.getParent(node.key)
  const index = parent.nodes.indexOf(node)

  change.insertNodeByKey(parent.key, index, inline, { normalize: false })
  change.moveNodeByKey(node.key, inline.key, 0, options)
}

/**
 * Wrap a node by `key` with `parent`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Node|Object} parent
 * @param {Object} options
 */

Changes.wrapNodeByKey = (change, key, parent) => {
  parent = Node.create(parent)
  parent = parent.set('nodes', parent.nodes.clear())

  if (parent.object == 'block') {
    change.wrapBlockByKey(key, parent)
    return
  }

  if (parent.object == 'inline') {
    change.wrapInlineByKey(key, parent)
    return
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
