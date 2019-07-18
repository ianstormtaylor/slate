import pick from 'lodash/pick'
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
  editor.addMarksByPath(path, offset, length, [mark])
}

Commands.addMarksByPath = (editor, path, offset, length, marks) => {
  marks = Mark.createSet(marks)

  if (!marks.size) {
    return
  }

  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  editor.withoutNormalizing(() => {
    // If it ends before the end of the node, we'll need to split to create a new
    // text with different marks.
    if (offset + length < node.text.length) {
      editor.splitNodeByPath(path, offset + length)
    }

    // Same thing if it starts after the start. But in that case, we need to
    // update our path and offset to point to the new start.
    if (offset > 0) {
      editor.splitNodeByPath(path, offset)
      path = PathUtils.increment(path)
      offset = 0
    }

    marks.forEach(mark => {
      editor.applyOperation({
        type: 'add_mark',
        path,
        mark: Mark.create(mark),
      })
    })
  })
}

/**
 * Sets specific set of marks on the path
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Array<Object|Mark>} marks
 */

Commands.replaceMarksByPath = (editor, path, offset, length, marks) => {
  const marksSet = Mark.createSet(marks)

  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  if (node.marks.equals(marksSet)) {
    return
  }

  editor.withoutNormalizing(() => {
    // If it ends before the end of the node, we'll need to split to create a new
    // text with different marks.
    if (offset + length < node.text.length) {
      editor.splitNodeByPath(path, offset + length)
    }

    // Same thing if it starts after the start. But in that case, we need to
    // update our path and offset to point to the new start.
    if (offset > 0) {
      editor.splitNodeByPath(path, offset)
      path = PathUtils.increment(path)
      offset = 0
    }

    const marksToApply = marksSet.subtract(node.marks)
    const marksToRemove = node.marks.subtract(marksSet)

    marksToRemove.forEach(mark => {
      editor.applyOperation({
        type: 'remove_mark',
        path,
        mark: Mark.create(mark),
      })
    })

    marksToApply.forEach(mark => {
      editor.applyOperation({
        type: 'add_mark',
        path,
        mark: Mark.create(mark),
      })
    })
  })
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
  editor.applyOperation({
    type: 'insert_node',
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
  const { annotations, document } = value
  document.assertNode(path)

  editor.withoutNormalizing(() => {
    for (const annotation of annotations.values()) {
      const { start, end } = annotation
      const isAtomic = editor.isAtomic(annotation)

      if (!isAtomic) {
        continue
      }

      if (!start.path.equals(path)) {
        continue
      }

      if (
        start.offset < offset &&
        (!end.path.equals(path) || end.offset > offset)
      ) {
        editor.removeAnnotation(annotation)
      }
    }

    editor.applyOperation({
      type: 'insert_text',
      path,
      offset,
      text,
    })

    if (marks) {
      editor.replaceMarksByPath(path, offset, text.length, marks)
    }
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
    previous.object === 'text' ? previous.text.length : previous.nodes.size

  editor.applyOperation({
    type: 'merge_node',
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
 * Move a node by `path` to a new parent by `newParentPath` and `newIndex`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {String} newParentPath
 * @param {Number} newIndex
 */

Commands.moveNodeByPath = (editor, path, newParentPath, newIndex) => {
  // If the operation path and newParentPath are the same,
  // this should be considered a NOOP
  if (PathUtils.isEqual(path, newParentPath)) {
    return editor
  }

  const newPath = newParentPath.concat(newIndex)

  if (PathUtils.isEqual(path, newPath)) {
    return editor
  }

  editor.applyOperation({
    type: 'move_node',
    path,
    newPath,
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
  editor.removeMarksByPath(path, offset, length, [mark])
}

Commands.removeMarksByPath = (editor, path, offset, length, marks) => {
  marks = Mark.createSet(marks)

  if (!marks.size) {
    return
  }

  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  editor.withoutNormalizing(() => {
    // If it ends before the end of the node, we'll need to split to create a new
    // text with different marks.
    if (offset + length < node.text.length) {
      editor.splitNodeByPath(path, offset + length)
    }

    // Same thing if it starts after the start. But in that case, we need to
    // update our path and offset to point to the new start.
    if (offset > 0) {
      editor.splitNodeByPath(path, offset)
      path = PathUtils.increment(path)
      offset = 0
    }

    marks.forEach(mark => {
      editor.applyOperation({
        type: 'remove_mark',
        path,
        offset,
        length,
        mark,
      })
    })
  })
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

  editor.withoutNormalizing(() => {
    if (node.object === 'text') {
      editor.removeMarksByPath(path, 0, node.text.length, node.marks)
      return
    }

    for (const [n, p] of node.texts()) {
      const pth = path.concat(p)
      editor.removeMarksByPath(pth, 0, n.text.length, n.marks)
    }
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
  const { document, annotations } = value
  const node = document.assertNode(path)
  const text = node.text.slice(offset, offset + length)

  editor.withoutNormalizing(() => {
    for (const annotation of annotations.values()) {
      const { start, end } = annotation
      const isAtomic = editor.isAtomic(annotation)

      if (!isAtomic) {
        continue
      }

      if (!start.path.equals(path)) {
        continue
      }

      if (
        start.offset < offset &&
        (!end.path.equals(path) || end.offset > offset)
      ) {
        editor.removeAnnotation(annotation)
      }
    }

    editor.applyOperation({
      type: 'remove_text',
      path,
      offset,
      text,
    })
  })
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
 * Replace a `length` of text at `offset` with new `text` and optional `marks`.
 *
 * @param {Editor} editor
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {string} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.replaceTextByPath = (editor, path, offset, length, text, marks) => {
  editor.withoutNormalizing(() => {
    editor.removeTextByPath(path, offset, length)
    editor.insertTextByPath(path, offset, text, marks)
  })
}

/**
 * Set `newProperties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Object|Mark} properties
 * @param {Object} newProperties
 */

Commands.setMarkByPath = (
  editor,
  path,
  offset,
  length,
  properties,
  newProperties
) => {
  properties = Mark.create(properties)
  newProperties = Mark.createProperties(newProperties)

  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  editor.withoutNormalizing(() => {
    // If it ends before the end of the node, we'll need to split to create a new
    // text with different marks.
    if (offset + length < node.text.length) {
      editor.splitNodeByPath(path, offset + length)
    }

    // Same thing if it starts after the start. But in that case, we need to
    // update our path and offset to point to the new start.
    if (offset > 0) {
      editor.splitNodeByPath(path, offset)
      path = PathUtils.increment(path)
      offset = 0
    }

    editor.applyOperation({
      type: 'set_mark',
      path,
      properties,
      newProperties,
    })
  })
}

/**
 * Set `properties` on a node by `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Object|String} newProperties
 */

Commands.setNodeByPath = (editor, path, newProperties) => {
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  newProperties = Node.createProperties(newProperties)
  const prevProperties = pick(node, Object.keys(newProperties))

  editor.applyOperation({
    type: 'set_node',
    path,
    properties: prevProperties,
    newProperties,
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
  let index = textOffset
  let lastPath = textPath

  editor.withoutNormalizing(() => {
    editor.splitNodeByKey(textPath, textOffset)

    for (const [, ancestorPath] of document.ancestors(textPath)) {
      const target = index
      index = lastPath.last() + 1
      lastPath = ancestorPath
      editor.splitNodeByPath(ancestorPath, index, { target })

      if (ancestorPath.equals(path)) {
        break
      }
    }
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
  'replaceMarks',
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
