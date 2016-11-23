
import Debug from 'debug'
import warn from '../utils/warn'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation')

/**
 * Operations.
 *
 * @type {Object}
 */

const OPERATIONS = {
  // Text operations.
  insert_text: insertText,
  remove_text: removeText,
  // Mark operations.
  add_mark: addMark,
  remove_mark: removeMark,
  set_mark: setMark,
  // Node operations.
  insert_node: insertNode,
  join_node: joinNode,
  move_node: moveNode,
  remove_node: removeNode,
  set_node: setNode,
  split_node: splitNode,
  // Selection operations.
  set_selection: setSelection
}

/**
 * Apply an `operation` to the current state.
 *
 * @param {Transform} transform
 * @param {Object} operation
 */

export function applyOperation(transform, operation) {
  let { state, operations } = transform
  const { type } = operation
  const fn = OPERATIONS[type]

  if (!fn) {
    throw new Error(`Unknown operation type: "${type}".`)
  }

  debug(type, operation)
  transform.state = fn(state, operation)
  transform.operations = operations.concat([operation])
}

/**
 * Add mark to text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function addMark(state, operation) {
  const { path, offset, length, mark } = operation
  let { document } = state
  let node = document.assertPath(path)
  node = node.addMark(offset, length, mark)
  document = document.updateDescendant(node)
  state = state.merge({ document })
  return state
}

/**
 * Insert a `node` at `index` in a node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function insertNode(state, operation) {
  const { path, index, node } = operation
  let { document } = state
  let parent = document.assertPath(path)
  const isParent = document == parent
  parent = parent.insertNode(index, node)
  document = isParent ? parent : document.updateDescendant(parent)
  state = state.merge({ document })
  return state
}

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function insertText(state, operation) {
  const { path, offset, text, marks } = operation
  let { document, selection } = state
  const { startKey, endKey, startOffset, endOffset } = selection
  let node = document.assertPath(path)

  // Update the document
  node = node.insertText(offset, text, marks)
  document = document.updateDescendant(node)

  // Update the selection
  if (startKey == node.key && startOffset >= offset) {
    selection = selection.moveStartOffset(text.length)
  }
  if (endKey == node.key && endOffset >= offset) {
    selection = selection.moveEndOffset(text.length)
  }

  state = state.merge({ document, selection })
  return state
}

/**
 * Join a node by `path` with a node `withPath`.
 *
 * @param {State} state
 * @param {Object} operation
 *   @param {Boolean} operation.deep (optional) Join recursively the
 *   respective last node and first node of the nodes' children. Like a zipper :)
 * @return {State}
 */

function joinNode(state, operation) {
  const { path, withPath, deep = false } = operation
  let { document, selection } = state
  const first = document.assertPath(withPath)
  const second = document.assertPath(path)

  document = document.joinNode(first, second, { deep })

  // If the operation is deep, or the nodes are text nodes, it means we will be
  // merging two text nodes together, so we need to update the selection.
  if (deep || second.kind == 'text') {
    const { anchorKey, anchorOffset, focusKey, focusOffset } = selection
    const firstText = first.kind == 'text' ? first : first.getLastText()
    const secondText = second.kind == 'text' ? second : second.getFirstText()

    if (anchorKey == secondText.key) {
      selection = selection.merge({
        anchorKey: firstText.key,
        anchorOffset: anchorOffset + firstText.characters.size
      })
    }

    if (focusKey == secondText.key) {
      selection = selection.merge({
        focusKey: firstText.key,
        focusOffset: focusOffset + firstText.characters.size
      })
    }
  }

  state = state.merge({ document, selection })
  return state
}

/**
 * Move a node by `path` to a new parent by `path` and `index`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function moveNode(state, operation) {
  const { path, newPath, newIndex } = operation
  let { document } = state
  const node = document.assertPath(path)

  // Remove the node from its current parent
  let parent = document.getParent(node.key)
  const isParent = document == parent
  const index = parent.nodes.indexOf(node)
  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)

  // Insert the new node to its new parent
  let target = document.assertPath(newPath)
  const isTarget = document == target
  target = target.insertNode(newIndex, node)
  document = isTarget ? target : document.updateDescendant(target)

  state = state.merge({ document })
  return state
}

/**
 * Remove mark from text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeMark(state, operation) {
  const { path, offset, length, mark } = operation
  let { document } = state
  let node = document.assertPath(path)
  node = node.removeMark(offset, length, mark)
  document = document.updateDescendant(node)
  state = state.merge({ document })
  return state
}

/**
 * Remove a node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeNode(state, operation) {
  const { path } = operation
  let { document, selection } = state
  const { startKey, endKey } = selection
  const node = document.assertPath(path)

  // If the selection is set, check to see if it needs to be updated.
  if (selection.isSet) {
    const hasStartNode = node.hasNode(startKey)
    const hasEndNode = node.hasNode(endKey)

    // If one of the selection's nodes is being removed, we need to update it.
    if (hasStartNode) {
      const prev = document.getPreviousText(startKey)
      const next = document.getNextText(startKey)

      if (prev) {
        selection = selection.moveStartTo(prev.key, prev.length)
      } else if (next) {
        selection = selection.moveStartTo(next.key, 0)
      } else {
        selection = selection.unset()
      }
    }

    if (hasEndNode) {
      const prev = document.getPreviousText(endKey)
      const next = document.getNextText(endKey)

      if (prev) {
        selection = selection.moveEndTo(prev.key, prev.length)
      } else if (next) {
        selection = selection.moveEndTo(next.key, 0)
      } else {
        selection = selection.unset()
      }
    }

  }

  // Remove the node from the document.
  let parent = document.getParent(node.key)
  const index = parent.nodes.indexOf(node)
  const isParent = document == parent
  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)

  // Update the document and selection.
  state = state.merge({ document, selection })
  return state
}

/**
 * Remove text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeText(state, operation) {
  const { path, offset, length } = operation
  const rangeOffset = offset + length
  let { document, selection } = state
  const { startKey, endKey, startOffset, endOffset } = selection
  let node = document.assertPath(path)

  // Update the selection
  if (startKey == node.key && startOffset >= rangeOffset) {
    selection = selection.moveStartOffset(-length)
  }
  if (endKey == node.key && endOffset >= rangeOffset) {
    selection = selection.moveEndOffset(-length)
  }

  node = node.removeText(offset, length)
  document = document.updateDescendant(node)
  state = state.merge({ document, selection })
  return state
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setMark(state, operation) {
  const { path, offset, length, mark, newMark } = operation
  let { document } = state
  let node = document.assertPath(path)
  node = node.updateMark(offset, length, mark, newMark)
  document = document.updateDescendant(node)
  state = state.merge({ document })
  return state
}

/**
 * Set `properties` on a node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setNode(state, operation) {
  const { path, properties } = operation
  let { document } = state
  let node = document.assertPath(path)

  // Deprecate the ability to overwite a node's children.
  if (properties.nodes && properties.nodes != node.nodes) {
    warn('Updating a Node\'s `nodes` property via `setNode()` is not allowed. Use the appropriate insertion and removal operations instead. The opeartion in question was:', operation)
    delete properties.nodes
  }

  // Deprecate the ability to change a node's key.
  if (properties.key && properties.key != node.key) {
    warn('Updating a Node\'s `key` property via `setNode()` is not allowed. There should be no reason to do this. The opeartion in question was:', operation)
    delete properties.key
  }

  node = node.merge(properties)
  document = document.updateDescendant(node)
  state = state.merge({ document })
  return state
}

/**
 * Set `properties` on the selection.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setSelection(state, operation) {
  let properties = { ...operation.properties }
  let { document, selection } = state

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
  state = state.merge({ selection })
  return state
}

/**
 * Split a node by `path` at `offset`.
 *
 * @param {State} state
 * @param {Object} operation
 *   @param {Array} operation.path The path of the node to split
 *   @param {Number} operation.offset (optional) Split using a relative offset
 *   @param {Number} operation.count (optional) Split after `count`
 *   children. Cannot be used in combination with offset.
 * @return {State}
 */

function splitNode(state, operation) {
  const { path, offset, count } = operation
  const { document } = state

  if (offset === undefined) {
    return state.merge({
      document: document.splitNodeAfter(path, count)
      // No need to update selection
    })
  }

  else {
    // Update document
    let newDocument = document.splitNode(path, offset)

    // Update selection
    let { selection } = state
    const { anchorKey, anchorOffset, focusKey, focusOffset } = selection

    const node = document.assertPath(path)
    // The text node that was split
    const splittedText = node.kind == 'text'
      ? node
      : node.getTextAtOffset(offset)
    const textOffset = node.kind == 'text'
      ? offset
      : offset - node.getOffset(splittedText.key)

    // Should we update the selection ?
    const shouldUpdateAnchor = splittedText.key == anchorKey && textOffset <= anchorOffset
    const shouldUpdateFocus = splittedText.key == focusKey && textOffset <= focusOffset
    if (shouldUpdateFocus || shouldUpdateAnchor) {
      // The node next to `node`, resulting from the split
      const secondNode = newDocument.getNextSibling(node.key)
      let secondText, newOffset

      if (shouldUpdateAnchor) {
        newOffset = anchorOffset - textOffset
        secondText = secondNode.kind == 'text'
          ? secondNode
          : secondNode.getTextAtOffset(newOffset)
        selection = selection.merge({
          anchorKey: secondText.key,
          anchorOffset: newOffset
        })
      }

      if (shouldUpdateFocus) {
        newOffset = focusOffset - textOffset
        secondText = secondNode.kind == 'text'
          ? secondNode
          : secondNode.getTextAtOffset(newOffset)
        selection = selection.merge({
          focusKey: secondText.key,
          focusOffset: newOffset
        })
      }
    }

    state = state.merge({
      document: newDocument,
      selection
    })
    return state
  }
}
