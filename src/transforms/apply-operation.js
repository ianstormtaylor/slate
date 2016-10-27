
import Debug from 'debug'
import warning from '../utils/warning'

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
 * @return {Transform}
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

  return transform
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
 * @return {State}
 */

function joinNode(state, operation) {
  const { path, withPath } = operation
  let { document, selection } = state
  const first = document.assertPath(withPath)
  const second = document.assertPath(path)

  // Update doc
  document = document.joinNode(first, second)

  // Update selection
  // When merging two texts together
  if (second.kind == 'text') {
    const { anchorKey, anchorOffset, focusKey, focusOffset } = selection
    // The final key is the `first` key
    if (anchorKey == second.key) {
      selection = selection.merge({
        anchorKey: first.key,
        anchorOffset: anchorOffset + first.characters.size
      })
    }
    if (focusKey == second.key) {
      selection = selection.merge({
        focusKey: first.key,
        focusOffset: focusOffset + first.characters.size
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
  let parent = document.getParent(node)
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

  // Preserve previous document
  const prevDocument = document

  // Update the document
  const node = document.assertPath(path)
  let parent = document.getParent(node)
  const index = parent.nodes.indexOf(node)
  const isParent = document == parent
  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)

  function getRemoved(key) {
    if (key === node.key) return node
    if (node.kind == 'text') return null
    return node.getDescendant(key)
  }

  // Update the selection, if one of the anchor/focus has been removed
  const startDesc = startKey ? getRemoved(startKey) : null
  const endDesc = endKey ? getRemoved(endKey) : null

  if (startDesc) {
    const prevText = prevDocument.getTexts()
      .takeUntil(text => text.key == startKey)
      .filter(text => !getRemoved(text.key))
      .last()
    if (!prevText) selection = selection.unset()
    else selection = selection.moveStartTo(prevText.key, prevText.length)
  }
  if (endDesc) {
    // The whole selection is inside the node, we collapse to the previous text node
    if (startKey == endKey) {
      selection = selection.collapseToStart()
    } else {
      const nextText = prevDocument.getTexts()
        .skipUntil(text => text.key == startKey)
        .slice(1)
        .filter(text => !getRemoved(text.key))
        .first()

      if (!nextText) selection = selection.unset()
      else selection = selection.moveEndTo(nextText.key, 0)
    }
  }

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
  let { document, selection } = state
  const { startKey, endKey, startOffset, endOffset } = selection
  let node = document.assertPath(path)

  const rangeOffset = offset + length

  // Update the document
  node = node.removeText(offset, length)
  document = document.updateDescendant(node)

  // Update the selection
  if (startKey == node.key && startOffset >= rangeOffset) {
    selection = selection.moveStartOffset(-length)
  }
  if (endKey == node.key && endOffset >= rangeOffset) {
    selection = selection.moveEndOffset(-length)
  }

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
  const { path, offset, length, mark, properties } = operation
  let { document } = state
  let node = document.assertPath(path)
  node = node.updateMark(offset, length, mark, properties)
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

  // Deprecate using setNode for updating children, or keys
  if (properties.nodes && properties.nodes != node.nodes) {
    warning('Updating Node.nodes through setNode is not allowed. Use appropriate insertion and removal functions.')
    delete properties.nodes
  } else if (properties.key && properties.key != node.key) {
    warning('Updating Node.key through setNode is not allowed. You should not have to update keys yourself.')
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
 * @return {State}
 */

function splitNode(state, operation) {
  const { path, offset } = operation
  const { document } = state

  // Update document
  const newDocument = document.splitNode(path, offset)

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
          : offset - node.getOffset(splittedText)

  // Should we update the selection ?
  const shouldUpdateAnchor = splittedText.key == anchorKey && textOffset <= anchorOffset
  const shouldUpdateFocus = splittedText.key == focusKey && textOffset <= focusOffset
  if (shouldUpdateFocus || shouldUpdateAnchor) {
    // The node next to `node`, resulting from the split
    const secondNode = newDocument.getNextSibling(node)
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
