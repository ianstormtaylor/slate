
import Normalize from '../utils/normalize'
import uid from '../utils/uid'

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @return {Transform}
 */

export function addMarkByKey(transform, key, offset, length, mark) {
  mark = Normalize.mark(mark)

  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.addMark(offset, length, mark)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'add-mark',
    offset,
    length,
    mark,
    path,
  })

  return transform
}

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @return {Transform}
 */

export function insertNodeByKey(transform, key, index, node) {
  let { state } = transform
  let { document } = state
  let parent = document.key == key ? document : document.assertDescendant(key)
  const isParent = document == parent
  const path = document.getPath(parent)
  const nodes = parent.nodes.splice(index, 0, node)

  parent = parent.merge({ nodes })
  document = isParent ? parent : document.updateDescendant(parent)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'insert-node',
    index,
    node,
    path,
  })

  return transform
}

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {String} text
 * @param {Set} marks (optional)
 * @return {Transform}
 */

export function insertTextByKey(transform, key, offset, text, marks) {
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.insertText(offset, text, marks)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'insert-text',
    offset,
    marks,
    path,
    text,
  })

  return transform
}

/**
 * Move a node by `key` to a new parent by `key` and `index`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} newKey
 * @param {Number} index
 * @return {Transform}
 */

export function moveNodeByKey(transform, key, newKey, newIndex) {
  let { state } = transform
  let { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(node)
  const newPath = document.getPath(newKey)
  let parent = document.getParent(node)
  const isParent = document == parent
  const index = parent.nodes.indexOf(node)

  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)

  let target = document.assertDescendant(newKey)
  const isTarget = document == target

  target = target.insertNode(newIndex, node)
  document = isTarget ? target : document.updateDescendant(target)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'move-node',
    path,
    newPath,
    newIndex,
  })

  return transform
}

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @return {Transform}
 */

export function removeMarkByKey(transform, key, offset, length, mark) {
  mark = Normalize.mark(mark)

  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.removeMark(offset, length, mark)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'remove-mark',
    offset,
    length,
    mark,
    path,
  })

  return transform
}

/**
 * Remove a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @return {Transform}
 */

export function removeNodeByKey(transform, key) {
  let { state } = transform
  let { document } = state
  const node = document.assertDescendant(key)
  const path = document.getPath(node)
  let parent = document.getParent(node)
  const index = parent.nodes.indexOf(node)
  const isParent = document == parent

  parent = parent.removeNode(index)
  document = isParent ? parent : document.updateDescendant(parent)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'remove-node',
    path,
  })

  return transform
}

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @return {Transform}
 */

export function removeTextByKey(transform, key, offset, length) {
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.removeText(offset, length)
  document = document.updateDescendant(node)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'remove-text',
    offset,
    length,
    path,
  })

  return transform
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @return {Transform}
 */

export function setMarkByKey(transform, key, offset, length, mark, properties) {
  mark = Normalize.mark(mark)
  properties = Normalize.markProperties(properties)

  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.updateMark(offset, length, mark, properties)
  document = document.updateDescendant(node)
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'set-mark',
    offset,
    length,
    mark,
    path,
    properties,
  })

  return transform
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object || String} properties
 * @return {Transform}
 */

export function setNodeByKey(transform, key, properties) {
  properties = Normalize.nodeProperties(properties)

  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)

  node = node.merge(properties)
  document = document.updateDescendant(node)
  document = document.normalize()
  state = state.merge({ document })

  transform.state = state
  transform.operations.push({
    type: 'set-node',
    path,
    properties,
  })

  return transform
}

/**
 * Split a node by `key` at `offset`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @return {Transform}
 */

export function splitNodeByKey(transform, key, offset) {
  let { state } = transform
  let { document } = state
  let node = document.assertDescendant(key)
  const path = document.getPath(node)
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

  transform.state = state
  transform.operations.push({
    type: 'split-node',
    offset,
    path,
  })

  return transform
}

