
import Debug from 'debug'
import warn from '../utils/warn'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation')

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

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
  set_selection: setSelection,
  // State data operations.
  set_data: setData
}

/**
 * Apply an `operation` to the current state.
 *
 * @param {Transform} transform
 * @param {Object} operation
 */

Transforms.applyOperation = (transform, operation) => {
  const { state, operations } = transform
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
  state = state.set('document', document)
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
  state = state.set('document', document)
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
  const { anchorKey, focusKey, anchorOffset, focusOffset } = selection
  let node = document.assertPath(path)

  // Update the document
  node = node.insertText(offset, text, marks)
  document = document.updateDescendant(node)

  // Update the selection
  if (anchorKey == node.key && anchorOffset >= offset) {
    selection = selection.moveAnchor(text.length)
  }
  if (focusKey == node.key && focusOffset >= offset) {
    selection = selection.moveFocus(text.length)
  }

  state = state.set('document', document).set('selection', selection)
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

  state = state.set('document', document).set('selection', selection)
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
  const index = path[path.length - 1]
  const parentPath = path.slice(0, -1)

  // Remove the node from its current parent
  let parent = document.getParent(node.key)
  parent = parent.removeNode(index)
  document = parent.kind === 'document' ? parent : document.updateDescendant(parent)

  // Check if `parent` is an anchestor of `target`
  const isAncestor = parentPath.every((x, i) => x === newPath[i])

  let target

  // If `parent` is an ancestor of `target` and their paths have same length,
  // then `parent` and `target` are equal.
  if (isAncestor && parentPath.length === newPath.length) {
    target = parent
  }

  // Else if `parent` is an ancestor of `target` and `node` index is less than
  // the index of the `target` ancestor with the same depth of `node`,
  // then removing `node` changes the path to `target`.
  // So we have to adjust `newPath` before picking `target`.
  else if (isAncestor && index < newPath[parentPath.length]) {
    newPath[parentPath.length]--
    target = document.assertPath(newPath)
  }

  // Else pick `target`
  else {
    target = document.assertPath(newPath)
  }

  // Insert the new node to its new parent
  target = target.insertNode(newIndex, node)
  document = target.kind === 'document' ? target : document.updateDescendant(target)

  state = state.set('document', document)
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
  state = state.set('document', document)
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
        selection = selection.deselect()
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
        selection = selection.deselect()
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
  state = state.set('document', document).set('selection', selection)
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
  const { anchorKey, focusKey, anchorOffset, focusOffset } = selection
  let node = document.assertPath(path)

  // Update the selection
  if (anchorKey == node.key && anchorOffset >= rangeOffset) {
    selection = selection.moveAnchor(-length)
  }
  if (focusKey == node.key && focusOffset >= rangeOffset) {
    selection = selection.moveFocus(-length)
  }

  node = node.removeText(offset, length)
  document = document.updateDescendant(node)
  state = state.set('document', document).set('selection', selection)
  return state
}

/**
 * Set `data` on `state`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setData(state, operation) {
  const { properties } = operation
  let { data } = state

  data = data.merge(properties)
  state = state.set('data', data)
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
  state = state.set('document', document)
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
  document = node.kind === 'document' ? node : document.updateDescendant(node)
  state = state.set('document', document)
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
  const properties = { ...operation.properties }
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
  state = state.set('selection', selection)
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
  let { document, selection } = state

  // If there's no offset, it's using the `count` instead.
  if (offset == null) {
    document = document.splitNodeAfter(path, count)
    state = state.set('document', document)
    return state
  }

  // Otherwise, split using the `offset`, but calculate a few things first.
  const node = document.assertPath(path)
  const text = node.kind == 'text' ? node : node.getTextAtOffset(offset)
  const textOffset = node.kind == 'text' ? offset : offset - node.getOffset(text.key)
  const { anchorKey, anchorOffset, focusKey, focusOffset } = selection

  document = document.splitNode(path, offset)

  // Determine whether we need to update the selection.
  const splitAnchor = text.key == anchorKey && textOffset <= anchorOffset
  const splitFocus = text.key == focusKey && textOffset <= focusOffset

  // If either the anchor of focus was after the split, we need to update them.
  if (splitFocus || splitAnchor) {
    const nextText = document.getNextText(text.key)

    if (splitAnchor) {
      selection = selection.merge({
        anchorKey: nextText.key,
        anchorOffset: anchorOffset - textOffset
      })
    }

    if (splitFocus) {
      selection = selection.merge({
        focusKey: nextText.key,
        focusOffset: focusOffset - textOffset
      })
    }
  }

  state = state.set('document', document).set('selection', selection)
  return state
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
