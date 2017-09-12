
import Debug from 'debug'
import logger from 'slate-dev-logger'

import Node from '../models/node'
import Mark from '../models/mark'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation:apply')

/**
 * Applying functions.
 *
 * @type {Object}
 */

const APPLIERS = {

  /**
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  add_mark(state, operation) {
    const { path, offset, length } = operation
    const mark = Mark.create(operation.mark)
    let { document } = state
    let node = document.assertPath(path)
    node = node.addMark(offset, length, mark)
    document = document.updateNode(node)
    state = state.set('document', document)
    return state
  },

  /**
   * Insert a `node` at `index` in a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  insert_node(state, operation) {
    const { path } = operation
    const node = Node.create(operation.node)
    const index = path[path.length - 1]
    const rest = path.slice(0, -1)
    let { document } = state
    let parent = document.assertPath(rest)
    parent = parent.insertNode(index, node)
    document = document.updateNode(parent)
    state = state.set('document', document)
    return state
  },

  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  insert_text(state, operation) {
    const { path, offset, text } = operation

    let { marks } = operation
    if (Array.isArray(marks)) marks = Mark.createSet(marks)

    let { document, selection } = state
    const { anchorKey, focusKey, anchorOffset, focusOffset } = selection
    let node = document.assertPath(path)

    // Update the document
    node = node.insertText(offset, text, marks)
    document = document.updateNode(node)

    // Update the selection
    if (anchorKey == node.key && anchorOffset >= offset) {
      selection = selection.moveAnchor(text.length)
    }
    if (focusKey == node.key && focusOffset >= offset) {
      selection = selection.moveFocus(text.length)
    }

    state = state.set('document', document).set('selection', selection)
    return state
  },

  /**
   * Merge a node at `path` with the previous node.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  merge_node(state, operation) {
    const { path } = operation
    const withPath = path.slice(0, path.length - 1).concat([path[path.length - 1] - 1])
    let { document, selection } = state
    const one = document.assertPath(withPath)
    const two = document.assertPath(path)
    let parent = document.getParent(one.key)
    const oneIndex = parent.nodes.indexOf(one)
    const twoIndex = parent.nodes.indexOf(two)

    // Perform the merge in the document.
    parent = parent.mergeNode(oneIndex, twoIndex)
    document = document.updateNode(parent)

    // If the nodes are text nodes and the selection is inside the second node
    // update it to refer to the first node instead.
    if (one.kind == 'text') {
      const { anchorKey, anchorOffset, focusKey, focusOffset } = selection
      let normalize = false

      if (anchorKey == two.key) {
        selection = selection.moveAnchorTo(one.key, one.text.length + anchorOffset)
        normalize = true
      }

      if (focusKey == two.key) {
        selection = selection.moveFocusTo(one.key, one.text.length + focusOffset)
        normalize = true
      }

      if (normalize) {
        selection = selection.normalize(document)
      }
    }

    // Update the document and selection.
    state = state.set('document', document).set('selection', selection)
    return state
  },

  /**
   * Move a node by `path` to `newPath`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  move_node(state, operation) {
    const { path, newPath } = operation
    const newIndex = newPath[newPath.length - 1]
    const newParentPath = newPath.slice(0, -1)
    const oldParentPath = path.slice(0, -1)
    const oldIndex = path[path.length - 1]
    let { document } = state
    const node = document.assertPath(path)

    // Remove the node from its current parent.
    let parent = document.getParent(node.key)
    parent = parent.removeNode(oldIndex)
    document = document.updateNode(parent)

    // Find the new target...
    let target

    // If the old path and the rest of the new path are the same, then the new
    // target is the old parent.
    if (
      (oldParentPath.every((x, i) => x === newParentPath[i])) &&
      (oldParentPath.length === newParentPath.length)
    ) {
      target = parent
    }

    // Otherwise, if the old path removal resulted in the new path being no longer
    // correct, we need to decrement the new path at the old path's last index.
    else if (
      (oldParentPath.every((x, i) => x === newParentPath[i])) &&
      (oldIndex < newParentPath[oldParentPath.length])
    ) {
      newParentPath[oldParentPath.length]--
      target = document.assertPath(newParentPath)
    }

    // Otherwise, we can just grab the target normally...
    else {
      target = document.assertPath(newParentPath)
    }

    // Insert the new node to its new parent.
    target = target.insertNode(newIndex, node)
    document = document.updateNode(target)
    state = state.set('document', document)
    return state
  },

  /**
   * Remove mark from text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_mark(state, operation) {
    const { path, offset, length } = operation
    const mark = Mark.create(operation.mark)
    let { document } = state
    let node = document.assertPath(path)
    node = node.removeMark(offset, length, mark)
    document = document.updateNode(node)
    state = state.set('document', document)
    return state
  },

  /**
   * Remove a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_node(state, operation) {
    const { path } = operation
    let { document, selection } = state
    const { startKey, endKey } = selection
    const node = document.assertPath(path)

    // If the selection is set, check to see if it needs to be updated.
    if (selection.isSet) {
      const hasStartNode = node.hasNode(startKey)
      const hasEndNode = node.hasNode(endKey)
      let normalize = false

      // If one of the selection's nodes is being removed, we need to update it.
      if (hasStartNode) {
        const prev = document.getPreviousText(startKey)
        const next = document.getNextText(startKey)

        if (prev) {
          selection = selection.moveStartTo(prev.key, prev.text.length)
          normalize = true
        } else if (next) {
          selection = selection.moveStartTo(next.key, 0)
          normalize = true
        } else {
          selection = selection.deselect()
        }
      }

      if (hasEndNode) {
        const prev = document.getPreviousText(endKey)
        const next = document.getNextText(endKey)

        if (prev) {
          selection = selection.moveEndTo(prev.key, prev.text.length)
          normalize = true
        } else if (next) {
          selection = selection.moveEndTo(next.key, 0)
          normalize = true
        } else {
          selection = selection.deselect()
        }
      }

      if (normalize) {
        selection = selection.normalize(document)
      }
    }

    // Remove the node from the document.
    let parent = document.getParent(node.key)
    const index = parent.nodes.indexOf(node)
    parent = parent.removeNode(index)
    document = document.updateNode(parent)

    // Update the document and selection.
    state = state.set('document', document).set('selection', selection)
    return state
  },

  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_text(state, operation) {
    const { path, offset, text } = operation
    const { length } = text
    const rangeOffset = offset + length
    let { document, selection } = state
    const { anchorKey, focusKey, anchorOffset, focusOffset } = selection
    let node = document.assertPath(path)

    // Update the selection.
    if (anchorKey == node.key && anchorOffset >= rangeOffset) {
      selection = selection.moveAnchor(-length)
    }

    if (focusKey == node.key && focusOffset >= rangeOffset) {
      selection = selection.moveFocus(-length)
    }

    node = node.removeText(offset, length)
    document = document.updateNode(node)
    state = state.set('document', document).set('selection', selection)
    return state
  },

  /**
   * Set `data` on `state`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_data(state, operation) {
    const { properties } = operation
    let { data } = state

    data = data.merge(properties)
    state = state.set('data', data)
    return state
  },

  /**
   * Set `properties` on mark on text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_mark(state, operation) {
    const { path, offset, length, properties } = operation
    const mark = Mark.create(operation.mark)
    let { document } = state
    let node = document.assertPath(path)
    node = node.updateMark(offset, length, mark, properties)
    document = document.updateNode(node)
    state = state.set('document', document)
    return state
  },

  /**
   * Set `properties` on a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_node(state, operation) {
    const { path, properties } = operation
    let { document } = state
    let node = document.assertPath(path)

    // Warn when trying to overwite a node's children.
    if (properties.nodes && properties.nodes != node.nodes) {
      logger.warn('Updating a Node\'s `nodes` property via `setNode()` is not allowed. Use the appropriate insertion and removal operations instead. The opeartion in question was:', operation)
      delete properties.nodes
    }

    // Warn when trying to change a node's key.
    if (properties.key && properties.key != node.key) {
      logger.warn('Updating a Node\'s `key` property via `setNode()` is not allowed. There should be no reason to do this. The opeartion in question was:', operation)
      delete properties.key
    }

    node = node.merge(properties)
    document = document.updateNode(node)
    state = state.set('document', document)
    return state
  },

  /**
   * Set `properties` on the selection.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_selection(state, operation) {
    const properties = { ...operation.properties }
    let { document, selection } = state

    if (properties.marks != null) {
      properties.marks = Mark.createSet(properties.marks)
    }

    if (properties.anchorPath !== undefined) {
      properties.anchorKey = properties.anchorPath === null
        ? null
        : document.assertPath(properties.anchorPath).key
      delete properties.anchorPath
    }

    if (properties.focusPath !== undefined) {
      properties.focusKey = properties.focusPath === null
        ? null
        : document.assertPath(properties.focusPath).key
      delete properties.focusPath
    }

    selection = selection.merge(properties)
    selection = selection.normalize(document)
    state = state.set('selection', selection)
    return state
  },

  /**
   * Split a node by `path` at `offset`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  split_node(state, operation) {
    const { path, position } = operation
    let { document, selection } = state

    // Calculate a few things...
    const node = document.assertPath(path)
    let parent = document.getParent(node.key)
    const index = parent.nodes.indexOf(node)

    // Split the node by its parent.
    parent = parent.splitNode(index, position)
    document = document.updateNode(parent)

    // Determine whether we need to update the selection...
    const { startKey, endKey, startOffset, endOffset } = selection
    const next = document.getNextText(node.key)
    let normalize = false

    // If the start point is after or equal to the split, update it.
    if (node.key == startKey && position <= startOffset) {
      selection = selection.moveStartTo(next.key, startOffset - position)
      normalize = true
    }

    // If the end point is after or equal to the split, update it.
    if (node.key == endKey && position <= endOffset) {
      selection = selection.moveEndTo(next.key, endOffset - position)
      normalize = true
    }

    // Normalize the selection if we changed it, since the methods we use might
    // leave it in a non-normalized state.
    if (normalize) {
      selection = selection.normalize(document)
    }

    // Return the updated state.
    state = state.set('document', document).set('selection', selection)
    return state
  },

}

/**
 * Apply an `operation` to a `state`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State} state
 */

function applyOperation(state, operation) {
  const { type } = operation
  const apply = APPLIERS[type]

  if (!apply) {
    throw new Error(`Unknown operation type: "${type}".`)
  }

  debug(type, operation)
  state = apply(state, operation)
  return state
}

/**
 * Export.
 *
 * @type {Function}
 */

export default applyOperation
