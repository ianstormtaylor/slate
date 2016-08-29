
import uid from '../utils/uid'

/**
 * Add mark to text at `offset` and `length` in node by `key`.
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
 * Insert a `node` at `index` in a node by `key`.
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
  const nodes = parent.nodes.splice(index, 0, node)
  parent = parent.merge({ nodes })
  document = isParent ? parent : document.updateDescendant(parent)
  state = state.merge({ document })
  return state
}

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function insertText(state, operation) {
  const { path, offset, text, marks } = operation
  let { document } = state
  let node = document.assertPath(path)
  node = node.insertText(offset, text, marks)
  document = document.updateDescendant(node)
  state = state.merge({ document })
  return state
}

/**
 * Move a node by `key` to a new parent by `key` and `index`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function moveNode(state, operation) {
  const { path, newPath, newIndex } = operation
  let { document } = state
  const node = document.assertPath(path)

  let parent = document.getParent(node)
  const isParent = document == parent
  const index = parent.nodes.indexOf(node)
  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)

  let target = document.assertPath(newPath)
  const isTarget = document == target
  target = target.insertNode(newIndex, node)
  document = isTarget ? target : document.updateDescendant(target)

  state = state.merge({ document })
  return state
}

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
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
 * Remove a node by `key`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeNode(state, operation) {
  const { path } = operation
  let { document } = state
  const node = document.assertPath(path)
  let parent = document.getParent(node)
  const index = parent.nodes.indexOf(node)
  const isParent = document == parent
  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)
  document = document.normalize()
  state = state.merge({ document })
  return state
}

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeText(state, operation) {
  const { path, offset, length } = operation
  let { document } = state
  let node = document.assertPath(path)
  node = node.removeText(offset, length)
  document = document.updateDescendant(node)
  document = document.normalize()
  state = state.merge({ document })
  return state
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `key`.
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
 * Set `properties` on a node by `key`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setNode(state, operation) {
  const { path, properties } = operation
  let { document } = state
  let node = document.assertPath(path)
  node = node.merge(properties)
  document = document.updateDescendant(node)
  document = document.normalize()
  state = state.merge({ document })
  return state
}

/**
 * Set the selection to a new `selection`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setSelection(state, operation) {
  let { selection } = operation
  selection = state.selection.merge(selection)
  state = state.merge({ selection })
  return state
}

/**
 * Split a node by `key` at `offset`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function splitNode(state, operation) {
  const { path, offset } = operation
  let { document } = state
  let node = document.assertPath(path)
  let parent = document.getParent(node)
  const isParent = document == parent
  const index = parent.nodes.indexOf(node)

  let child = node
  let one
  let two

  if (node.kind != 'text') {
    child = node.getTextAtOffset(offset)
  }

  while (child && child != parent) {
    if (child.kind == 'text') {
      const i = node.kind == 'text' ? offset : offset - node.getOffset(child)
      const { characters } = child
      const oneChars = characters.take(i)
      const twoChars = characters.skip(i)
      one = child.merge({ characters: oneChars })
      two = child.merge({ characters: twoChars, key: uid() })
    }

    else {
      const { nodes } = child
      const oneNodes = nodes.takeUntil(n => n.key == one.key).push(one)
      const twoNodes = nodes.skipUntil(n => n.key == one.key).rest().unshift(two)
      one = child.merge({ nodes: oneNodes })
      two = child.merge({ nodes: twoNodes, key: uid() })
    }

    child = document.getParent(child)
  }

  parent = parent.removeNode(index)
  parent = parent.insertNode(index, two)
  parent = parent.insertNode(index, one)
  document = isParent ? parent : document.updateDescendant(parent)
  state = state.merge({ document })
  return state
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {

  // Text operations.
  insert_text: insertText,
  remove_text: removeText,

  // Mark operations.
  add_mark: addMark,
  remove_mark: removeMark,
  set_mark: setMark,

  // Node operations.
  insert_node: insertNode,
  move_node: moveNode,
  remove_node: removeNode,
  set_node: setNode,
  split_node: splitNode,

  // Selection operations.
  set_selection: setSelection,

}
