import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import PathUtils from '../utils/path-utils'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Add mark to text at `offset` and `length` in node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 */

Commands.addMarkByPath = (editor, path, offset, length, mark) => {
  mark = Mark.create(mark)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
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

  operations.forEach(op => editor.applyOperation(op))
}

/**
 * Insert a `fragment` at `index` in a node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} index
 * @param {Fragment} fragment
 */

Commands.insertFragmentByPath = (editor, path, index, fragment) => {
  fragment.nodes.forEach((node, i) => {
    editor.insertNodeByPath(path, index + i, node)
  })
}

/**
 * Insert a `node` at `index` in a node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} index
 * @param {Node} node
 */

Commands.insertNodeByPath = (editor, path, index, node) => {
  const { value } = editor

  editor.applyOperation({
    type: 'insert_node',
    value,
    path: path.concat(index),
    node,
  })
}

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.insertTextByPath = (editor, path, offset, text, marks) => {
  const { value } = editor
  const { decorations, document } = value
  const node = document.assertNode(path)
  marks = marks || node.getMarksAtIndex(offset)

  let updated = false
  const { key } = node

  const decs = decorations.filter(dec => {
    const { start, end, mark } = dec
    const isAtomic = editor.isAtomic(mark)
    if (!isAtomic) return true
    if (start.key !== key) return true

    if (start.offset < offset && (end.key !== key || end.offset > offset)) {
      updated = true
      return false
    }

    return true
  })

  if (updated) {
    editor.setDecorations(decs)
  }

  editor.applyOperation({
    type: 'insert_text',
    value,
    path,
    offset,
    text,
    marks,
  })
}

/**
 * Merge a node by `path` with the previous node.
 *
 * @param {Editor} editor
 * @param {Array} path
 */

Commands.mergeNodeByPath = (editor, path) => {
  const { value } = editor
  const { document } = value
  const original = document.getDescendant(path)
  const previous = document.getPreviousSibling(path)

  if (!previous) {
    throw new Error(
      `Unable to merge node with path "${path}", because it has no previous sibling.`
    )
  }

  const position =
    previous.object == 'text' ? previous.text.length : previous.nodes.size

  editor.applyOperation({
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
}

/**
 * Move a node by `path` to a new parent by `newPath` and `index`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {String} newPath
 * @param {Number} index
 */

Commands.moveNodeByPath = (editor, path, newPath, newIndex) => {
  const { value } = editor

  // If the operation path and newPath are the same,
  // this should be considered a NOOP
  if (PathUtils.isEqual(path, newPath)) {
    return editor
  }

  editor.applyOperation({
    type: 'move_node',
    value,
    path,
    newPath: newPath.concat(newIndex),
  })
}

/**
 * Remove mark from text at `offset` and `length` in node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 */

Commands.removeMarkByPath = (editor, path, offset, length, mark) => {
  mark = Mark.create(mark)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
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

  operations.forEach(op => editor.applyOperation(op))
}

/**
 * Remove all `marks` from node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 */

Commands.removeAllMarksByPath = (editor, path) => {
  const { state } = editor
  const { document } = state
  const node = document.assertNode(path)
  const texts = node.object === 'text' ? [node] : node.getTextsAsArray()

  texts.forEach(text => {
    text.getMarksAsArray().forEach(mark => {
      editor.removeMarkByKey(text.key, 0, text.text.length, mark)
    })
  })
}

/**
 * Remove a node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 */

Commands.removeNodeByPath = (editor, path) => {
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  editor.applyOperation({
    type: 'remove_node',
    value,
    path,
    node,
  })
}

/**
 * Remove text at `offset` and `length` in node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 */

Commands.removeTextByPath = (editor, path, offset, length) => {
  const { value } = editor
  const { decorations, document } = value
  const node = document.assertNode(path)
  const leaves = node.getLeaves()
  const { text } = node

  let updated = false
  const { key } = node
  const from = offset
  const to = offset + length

  const decs = decorations.filter(dec => {
    const { start, end, mark } = dec
    const isAtomic = editor.isAtomic(mark)
    if (!isAtomic) return true
    if (start.key !== key) return true

    if (start.offset < from && (end.key !== key || end.offset > from)) {
      updated = true
      return false
    }

    if (start.offset < to && (end.key !== key || end.offset > to)) {
      updated = true
      return null
    }

    return true
  })

  if (updated) {
    editor.setDecorations(decs)
  }

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
  removals.reverse().forEach(op => editor.applyOperation(op))
}

/**
`* Replace a `node` with another `node`
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Object|Node} node
 */

Commands.replaceNodeByPath = (editor, path, newNode) => {
  newNode = Node.create(newNode)
  const index = path.last()
  const parentPath = PathUtils.lift(path)

  editor.withoutNormalizing(() => {
    editor.removeNodeByPath(path)
    editor.insertNodeByPath(parentPath, index, newNode)
  })
}

/**
 * Replace A Length of Text with another string or text
 * @param {Editor} editor
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {string} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.replaceTextByPath = (editor, path, offset, length, text, marks) => {
  const { document } = editor.value
  const node = document.assertNode(path)

  if (length + offset > node.text.length) {
    length = node.text.length - offset
  }

  const range = document.createRange({
    anchor: { path, offset },
    focus: { path, offset: offset + length },
  })

  let activeMarks = document.getActiveMarksAtRange(range)

  editor.withoutNormalizing(() => {
    editor.removeTextByPath(path, offset, length)

    if (!marks) {
      // Do not use mark at index when marks and activeMarks are both empty
      marks = activeMarks ? activeMarks : []
    } else if (activeMarks) {
      // Do not use `has` because we may want to reset marks like font-size with
      // an updated data;
      activeMarks = activeMarks.filter(
        activeMark => !marks.find(m => activeMark.type === m.type)
      )

      marks = activeMarks.merge(marks)
    }

    editor.insertTextByPath(path, offset, text, marks)
  })
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 */

Commands.setMarkByPath = (editor, path, offset, length, mark, properties) => {
  mark = Mark.create(mark)
  properties = Mark.createProperties(properties)
  const { value } = editor

  editor.applyOperation({
    type: 'set_mark',
    value,
    path,
    offset,
    length,
    mark,
    properties,
  })
}

/**
 * Set `properties` on a node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Object|String} properties
 */

Commands.setNodeByPath = (editor, path, properties) => {
  properties = Node.createProperties(properties)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  editor.applyOperation({
    type: 'set_node',
    value,
    path,
    node,
    properties,
  })
}

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.setTextByPath = (editor, path, text, marks) => {
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  const end = node.text.length
  editor.replaceTextByPath(path, 0, end, text, marks)
}

/**
 * Split a node by `path` at `position`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} position
 * @param {Object} options
 */

Commands.splitNodeByPath = (editor, path, position, options = {}) => {
  const { target = null } = options
  const { value } = editor
  const { document } = value
  const node = document.getDescendant(path)

  editor.applyOperation({
    type: 'split_node',
    value,
    path,
    position,
    target,
    properties: {
      type: node.type,
      data: node.data,
    },
  })
}

/**
 * Split a node deeply down the tree by `path`, `textPath` and `textOffset`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Array} textPath
 * @param {Number} textOffset
 */

Commands.splitDescendantsByPath = (editor, path, textPath, textOffset) => {
  if (path.equals(textPath)) {
    editor.splitNodeByPath(textPath, textOffset)
    return
  }

  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  const text = document.assertNode(textPath)
  const ancestors = document.getAncestors(textPath)
  const nodes = ancestors
    .skipUntil(a => a.key == node.key)
    .reverse()
    .unshift(text)

  let previous
  let index

  editor.withoutNormalizing(() => {
    nodes.forEach(n => {
      const prevIndex = index == null ? null : index
      index = previous ? n.nodes.indexOf(previous) + 1 : textOffset
      previous = n
      editor.splitNodeByKey(n.key, index, { target: prevIndex })
    })
  })
}

/**
 * Unwrap content from an inline parent with `properties`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Object|String} properties
 */

Commands.unwrapInlineByPath = (editor, path, properties) => {
  const { value } = editor
  const { document, selection } = value
  const node = document.assertNode(path)
  const first = node.getFirstText()
  const last = node.getLastText()
  const range = selection.moveToRangeOfNode(first, last)
  editor.unwrapInlineAtRange(range, properties)
}

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Object|String} properties
 */

Commands.unwrapBlockByPath = (editor, path, properties) => {
  const { value } = editor
  const { document, selection } = value
  const node = document.assertNode(path)
  const first = node.getFirstText()
  const last = node.getLastText()
  const range = selection.moveToRangeOfNode(first, last)
  editor.unwrapBlockAtRange(range, properties)
}

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Editor} editor
 * @param {Array} path
 */

Commands.unwrapNodeByPath = (editor, path) => {
  const { value } = editor
  const { document } = value
  document.assertNode(path)

  const parentPath = PathUtils.lift(path)
  const parent = document.assertNode(parentPath)
  const index = path.last()
  const parentIndex = parentPath.last()
  const grandPath = PathUtils.lift(parentPath)
  const isFirst = index === 0
  const isLast = index === parent.nodes.size - 1

  editor.withoutNormalizing(() => {
    if (parent.nodes.size === 1) {
      editor.moveNodeByPath(path, grandPath, parentIndex + 1)
      editor.removeNodeByPath(parentPath)
    } else if (isFirst) {
      editor.moveNodeByPath(path, grandPath, parentIndex)
    } else if (isLast) {
      editor.moveNodeByPath(path, grandPath, parentIndex + 1)
    } else {
      let updatedPath = PathUtils.increment(path, 1, parentPath.size - 1)
      updatedPath = updatedPath.set(updatedPath.size - 1, 0)
      editor.splitNodeByPath(parentPath, index)
      editor.moveNodeByPath(updatedPath, grandPath, parentIndex + 1)
    }
  })
}

/**
 * Unwrap all of the children of a node, by removing the node and replacing it
 * with the children in the tree.
 *
 * @param {Editor} editor
 * @param {Array} path
 */

Commands.unwrapChildrenByPath = (editor, path) => {
  path = PathUtils.create(path)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  const parentPath = PathUtils.lift(path)
  const index = path.last()
  const { nodes } = node

  editor.withoutNormalizing(() => {
    nodes.reverse().forEach((child, i) => {
      const childIndex = nodes.size - i - 1
      const childPath = path.push(childIndex)
      editor.moveNodeByPath(childPath, parentPath, index + 1)
    })

    editor.removeNodeByPath(path)
  })
}

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Block|Object|String} block
 */

Commands.wrapBlockByPath = (editor, path, block) => {
  block = Block.create(block)
  block = block.set('nodes', block.nodes.clear())
  const parentPath = PathUtils.lift(path)
  const index = path.last()
  const newPath = PathUtils.increment(path)

  editor.withoutNormalizing(() => {
    editor.insertNodeByPath(parentPath, index, block)
    editor.moveNodeByPath(newPath, path, 0)
  })
}

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Block|Object|String} inline
 */

Commands.wrapInlineByPath = (editor, path, inline) => {
  inline = Inline.create(inline)
  inline = inline.set('nodes', inline.nodes.clear())
  const parentPath = PathUtils.lift(path)
  const index = path.last()
  const newPath = PathUtils.increment(path)

  editor.withoutNormalizing(() => {
    editor.insertNodeByPath(parentPath, index, inline)
    editor.moveNodeByPath(newPath, path, 0)
  })
}

/**
 * Wrap a node by `path` with `node`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Node|Object} node
 */

Commands.wrapNodeByPath = (editor, path, node) => {
  node = Node.create(node)

  if (node.object === 'block') {
    editor.wrapBlockByPath(path, node)
  } else if (node.object === 'inline') {
    editor.wrapInlineByPath(path, node)
  }
}

/**
 * Mix in `*ByKey` variants.
 */

const COMMANDS = [
  'addMark',
  'insertFragment',
  'insertNode',
  'insertText',
  'mergeNode',
  'removeAllMarks',
  'removeMark',
  'removeNode',
  'removeText',
  'replaceNode',
  'replaceText',
  'setMark',
  'setNode',
  'setText',
  'splitNode',
  'unwrapBlock',
  'unwrapChildren',
  'unwrapInline',
  'unwrapNode',
  'wrapBlock',
  'wrapInline',
  'wrapNode',
]

for (const method of COMMANDS) {
  Commands[`${method}ByKey`] = (editor, key, ...args) => {
    const { value } = editor
    const { document } = value
    const path = document.assertPath(key)
    editor[`${method}ByPath`](path, ...args)
  }
}

// Moving nodes takes two keys, so it's slightly different.
Commands.moveNodeByKey = (editor, key, newKey, ...args) => {
  const { value } = editor
  const { document } = value
  const path = document.assertPath(key)
  const newPath = document.assertPath(newKey)
  editor.moveNodeByPath(path, newPath, ...args)
}

// Splitting descendants takes two keys, so it's slightly different.
Commands.splitDescendantsByKey = (editor, key, textKey, ...args) => {
  const { value } = editor
  const { document } = value
  const path = document.assertPath(key)
  const textPath = document.assertPath(textKey)
  editor.splitDescendantsByPath(path, textPath, ...args)
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
