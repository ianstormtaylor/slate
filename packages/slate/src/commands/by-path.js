import pick from 'lodash/pick'
import warning from 'tiny-warning'

import Block from '../models/block'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import Path from '../utils/path-utils'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Add mark to text at `offset` and `length` in node by `path`.
 *
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 */

Commands.addMarkByPath = (fn, editor) => (path, offset, length, mark) => {
  path = Path.create(path)
  mark = Mark.create(mark)
  editor.addMarksByPath(path, offset, length, [mark])
}

Commands.addMarksByPath = (fn, editor) => (path, offset, length, marks) => {
  path = Path.create(path)
  marks = Mark.createSet(marks)

  if (!marks.size) {
    return
  }

  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  marks = marks.subtract(node.marks)

  if (!marks.size) {
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
      path = Path.increment(path)
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
 * Insert a `fragment` at `index` in a node by `path`.
 *
 * @param {Array} path
 * @param {Number} index
 * @param {Fragment} fragment
 */

Commands.insertFragmentByPath = (fn, editor) => (path, index, fragment) => {
  path = Path.create(path)

  if (typeof index === 'number' && fragment) {
    warning(
      false,
      `As of slate@0.48 the \`editor.insertFragmentByPath\` command takes \`(targetPath, fragment)\`, instead of a \`(parentPath, index, fragment)\`.`
    )

    path = path.concat(index)
    index = null
  } else {
    fragment = index
    index = null
  }

  const parentPath = Path.lift(path)
  const start = path.last()

  fragment = fragment.mapDescendants(child => child.regenerateKey())

  fragment.nodes.forEach((node, i) => {
    const targetPath = parentPath.concat([start + i])
    editor.insertNodeByPath(targetPath, node)
  })
}

/**
 * Insert a `node` at `index` in a node by `path`.
 *
 * @param {Array} path
 * @param {Number} index
 * @param {Node} node
 */

Commands.insertNodeByPath = (fn, editor) => (path, index, node) => {
  path = Path.create(path)

  if (typeof index === 'number' && node) {
    warning(
      false,
      `As of slate@0.48 the \`editor.insertNodeByPath\` command takes \`(targetPath, node)\`, instead of a \`(parentPath, index, node)\`.`
    )

    path = path.concat(index)
    index = null
  } else {
    node = index
    index = null
  }

  editor.applyOperation({
    type: 'insert_node',
    path,
    node,
  })

  return path
}

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {Array} path
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.insertTextByPath = (fn, editor) => (path, offset, text, marks) => {
  path = Path.create(path)
  marks = Mark.createSet(marks)
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

    if (marks.size) {
      editor.addMarksByPath(path, offset, text.length, marks)
    }
  })
}

/**
 * Merge a node by `path` with the previous node.
 *
 * @param {Array} path
 * @return {List}
 */

Commands.mergeNodeByPath = (fn, editor) => path => {
  path = Path.create(path)
  const { value: { document } } = editor
  const node = document.assertNode(path)
  const prevPath = Path.decrement(path)
  const prev = document.assertNode(prevPath)
  const position = prev.object === 'text' ? prev.text.length : prev.nodes.size

  editor.applyOperation({
    type: 'merge_node',
    path,
    position,
    target: null,
    properties: {
      type: node.type,
      data: node.data,
    },
  })

  return prevPath
}

Commands.mergeBlockByPath = (fn, editor) => path => {
  path = Path.create(path)

  editor.withoutNormalizing(() => {
    const { value: { document } } = editor
    const node = document.assertNode(path)
    let blockPath

    // HACK: this should not be required, but since `closest` doesn't match the
    // current node first, we have to do this, since people can pass in the path
    // of the block to merge.
    if (node.object === 'block') {
      blockPath = path
    } else {
      ;[, blockPath] = document.closestBlock(path)
    }

    const prevBlock = document.previousBlock(path, { onlyLeaves: true })

    if (!prevBlock) {
      return
    }

    const [, prevPath] = prevBlock
    const newPath = Path.increment(prevPath)
    const commonAncestorPath = Path.relate(blockPath, prevPath)

    editor.moveNodeByPath(blockPath, newPath)
    path = editor.mergeNodeByPath(newPath)

    for (const [ancestor, ancestorPath] of document.ancestors(blockPath)) {
      if (ancestor.object === 'block') {
        if (
          ancestorPath.equals(commonAncestorPath) ||
          ancestor.nodes.size !== 1
        ) {
          break
        }

        editor.removeNodeByPath(ancestorPath)
      }
    }
  })

  return path
}

/**
 * Move a node by `path` to a new parent by `newParentPath` and `newIndex`.
 *
 * @param {Array} path
 * @param {String} newParentPath
 * @param {Number} newIndex
 */

Commands.moveNodeByPath = (fn, editor) => (path, newPath, index) => {
  path = Path.create(path)
  newPath = Path.create(newPath)

  if (typeof index === 'number') {
    warning(
      false,
      `As of slate@0.48 the \`editor.moveNodeByPath\` command takes \`(oldPath, newPath)\`, instead of a \`(oldPath, newParentPath, index)\`.`
    )

    newPath = newPath.concat(index)
    index = null
  }

  // It doesn't make sense to move a node into itself, so abort.
  // TODO: This should probably throw an error instead?
  if (Path.isAbove(path, newPath)) {
    return editor
  }

  if (Path.isEqual(path, newPath)) {
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
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 */

Commands.removeMarkByPath = (fn, editor) => (path, offset, length, mark) => {
  path = Path.create(path)
  mark = Mark.create(mark)
  editor.removeMarksByPath(path, offset, length, [mark])
}

Commands.removeMarksByPath = (fn, editor) => (path, offset, length, marks) => {
  path = Path.create(path)
  marks = Mark.createSet(marks)

  if (!marks.size) {
    return
  }

  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  marks = marks.intersect(node.marks)

  if (!marks.size) {
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
      path = Path.increment(path)
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
 * @param {Array} path
 */

Commands.removeAllMarksByPath = (fn, editor) => path => {
  path = Path.create(path)
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
 * @param {Array} path
 */

Commands.removeNodeByPath = (fn, editor) => path => {
  path = Path.create(path)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)

  editor.applyOperation({
    type: 'remove_node',
    path,
    node,
  })
}

Commands.removeChildrenByPath = (fn, editor) => path => {
  path = Path.create(path)
  const { value: { document } } = editor
  const node = document.assertNode(path)

  editor.withoutNormalizing(() => {
    const { size } = node.nodes
    const childPath = path.concat([0])

    for (let i = 0; i < size; i++) {
      editor.removeNodeByPath(childPath)
    }
  })
}

/**
 * Remove text at `offset` and `length` in node by `path`.
 *
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 */

Commands.removeTextByPath = (fn, editor) => (path, offset, length) => {
  path = Path.create(path)
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
 * @param {Array} path
 * @param {Object|Node} node
 */

Commands.replaceNodeByPath = (fn, editor) => (path, node) => {
  path = Path.create(path)
  node = Node.create(node)

  editor.withoutNormalizing(() => {
    editor.removeNodeByPath(path)
    editor.insertNodeByPath(path, node)
  })
}

/**
 * Replace a `length` of text at `offset` with new `text` and optional `marks`.
 *
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {string} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.replaceTextByPath = (fn, editor) => (
  path,
  offset,
  length,
  text,
  marks
) => {
  editor.withoutNormalizing(() => {
    editor.removeTextByPath(path, offset, length)
    editor.insertTextByPath(path, offset, text, marks)
  })
}

/**
 * Set `newProperties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Object|Mark} properties
 * @param {Object} newProperties
 */

Commands.setMarkByPath = (fn, editor) => (
  path,
  offset,
  length,
  properties,
  newProperties
) => {
  path = Path.create(path)
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
      path = Path.increment(path)
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
 * @param {Array} path
 * @param {Object|String} newProperties
 */

Commands.setNodeByPath = (fn, editor) => (path, newProperties) => {
  path = Path.create(path)
  newProperties = Node.createProperties(newProperties)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
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
 * @param {Array} path
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Commands.setTextByPath = (fn, editor) => (path, text, marks) => {
  path = Path.create(path)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  const end = node.text.length
  editor.replaceTextByPath(path, 0, end, text, marks)
}

/**
 * Split a node by `path` at `position`.
 *
 * @param {Array} path
 * @param {Number} position
 * @param {Object} options
 */

Commands.splitNodeByPath = (fn, editor) => (path, position, options = {}) => {
  path = Path.create(path)
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

  return Path.increment(path)
}

/**
 * Split a node deeply down the tree by `path`, `textPath` and `textOffset`.
 *
 * @param {Array} path
 * @param {Array} textPath
 * @param {Number} textOffset
 */

Commands.splitDescendantsByPath = (fn, editor) => (
  path,
  textPath,
  textOffset
) => {
  path = Path.create(path)
  textPath = Path.create(textPath)

  if (path.equals(textPath)) {
    return editor.splitNodeByPath(textPath, textOffset)
  }

  const { value } = editor
  const { document } = value
  let index = textOffset
  let lastPath = textPath

  editor.withoutNormalizing(() => {
    editor.splitNodeByPath(textPath, textOffset)

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
 * @param {Array} path
 * @param {Object|String} properties
 */

Commands.unwrapInlineByPath = (fn, editor) => (path, properties) => {
  path = Path.create(path)
  const range = editor.getRange(path)
  editor.unwrapInlineAtRange(range, properties)
}

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Array} path
 * @param {Object|String} properties
 */

Commands.unwrapBlockByPath = (fn, editor) => (path, properties) => {
  path = Path.create(path)
  const range = editor.getRange(path)
  editor.unwrapBlockAtRange(range, properties)
}

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Array} path
 */

Commands.unwrapNodeByPath = (fn, editor) => path => {
  path = Path.create(path)
  const { value } = editor
  const { document } = value
  document.assertNode(path)

  const parentPath = Path.lift(path)
  const parent = document.assertNode(parentPath)
  const index = path.last()
  const parentIndex = parentPath.last()
  const grandPath = Path.lift(parentPath)
  const isFirst = index === 0
  const isLast = index === parent.nodes.size - 1

  editor.withoutNormalizing(() => {
    if (parent.nodes.size === 1) {
      editor.moveNodeByPath(path, grandPath.concat(parentIndex + 1))
      editor.removeNodeByPath(parentPath)
    } else if (isFirst) {
      editor.moveNodeByPath(path, grandPath.concat(parentIndex))
    } else if (isLast) {
      editor.moveNodeByPath(path, grandPath.concat(parentIndex + 1))
    } else {
      let updatedPath = Path.increment(path, 1, parentPath.size - 1)
      updatedPath = updatedPath.set(updatedPath.size - 1, 0)
      editor.splitNodeByPath(parentPath, index)
      editor.moveNodeByPath(updatedPath, grandPath.concat(parentIndex + 1))
    }
  })
}

/**
 * Unwrap all of the children of a node, by removing the node and replacing it
 * with the children in the tree.
 *
 * @param {Array} path
 */

Commands.unwrapChildrenByPath = (fn, editor) => path => {
  path = Path.create(path)
  const { value } = editor
  const { document } = value
  const node = document.assertNode(path)
  const newPath = Path.increment(path)
  const { nodes } = node

  editor.withoutNormalizing(() => {
    nodes.reverse().forEach((child, i) => {
      const childIndex = nodes.size - i - 1
      const childPath = path.push(childIndex)
      editor.moveNodeByPath(childPath, newPath)
    })

    editor.removeNodeByPath(path)
  })
}

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Array} path
 * @param {Block|Object|String} block
 */

Commands.wrapBlockByPath = (fn, editor) => (path, block) => {
  path = Path.create(path)
  block = Block.create(block)
  block = block.set('nodes', block.nodes.clear())
  const newPath = Path.increment(path)

  editor.withoutNormalizing(() => {
    editor.insertNodeByPath(path, block)
    editor.moveNodeByPath(newPath, path.concat(0))
  })
}

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Array} path
 * @param {Block|Object|String} inline
 */

Commands.wrapInlineByPath = (fn, editor) => (path, inline) => {
  path = Path.create(path)
  inline = Inline.create(inline)
  inline = inline.set('nodes', inline.nodes.clear())
  const newPath = Path.increment(path)

  editor.withoutNormalizing(() => {
    editor.insertNodeByPath(path, inline)
    editor.moveNodeByPath(newPath, path.concat(0))
  })
}

/**
 * Wrap a node by `path` with `node`.
 *
 * @param {Array} path
 * @param {Node|Object} node
 */

Commands.wrapNodeByPath = (fn, editor) => (path, node) => {
  path = Path.create(path)
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
  Commands[`${method}ByKey`] = (fn, editor) => (key, ...args) => {
    warning(
      false,
      `As of slate@0.48 the \`editor.${method}ByKey\` command is deprecated. Use the \`editor.${method}ByPath\` command instead.`
    )

    const { value } = editor
    const { document } = value
    const path = document.assertPath(key)
    editor[`${method}ByPath`](path, ...args)
  }
}

// Moving nodes takes two keys, so it's slightly different.
Commands.moveNodeByKey = (fn, editor) => (key, newKey, ...args) => {
  warning(
    false,
    `As of slate@0.48 the \`editor.moveNodeByKey\` command is deprecated. Use the \`editor.moveNodeByPath\` command instead.`
  )

  const { value } = editor
  const { document } = value
  const path = document.assertPath(key)
  const newPath = document.assertPath(newKey)
  editor.moveNodeByPath(path, newPath, ...args)
}

// Splitting descendants takes two keys, so it's slightly different.
Commands.splitDescendantsByKey = (fn, editor) => (key, textKey, ...args) => {
  warning(
    false,
    `As of slate@0.48 the \`editor.splitDescendantsByKey\` command is deprecated. Use the \`editor.splitDescendantsByPath\` command instead.`
  )

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
