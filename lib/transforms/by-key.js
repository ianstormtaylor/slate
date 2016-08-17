
import Normalize from '../utils/normalize'

/**
 * Remove a node by `key`.
 *
 * @param {State} state
 * @param {String} key
 * @return {State}
 */

export function removeNodeByKey(state, key) {
  let { document } = state
  document = document.removeDescendant(key)
  document = document.normalize()
  state = state.merge({ document })
  return state
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {State} state
 * @param {String} key
 * @param {Object or String} properties
 * @return {State}
 */

export function setNodeByKey(state, key, properties) {
  properties = Normalize.nodeProperties(properties)
  let { document } = state
  let descendant = document.assertDescendant(key)
  descendant = descendant.merge(properties)
  document = document.updateDescendant(descendant)
  state = state.merge({ document })
  return state
}

/**
 * Insert a `node` after a node by `key`.
 *
 * @param {State} state
 * @param {String} key
 * @param {Node} node
 * @return {State}
 */

export function insertNodeAfterNodeByKey(state, key, node) {
  let { document } = state
  let descendant = document.assertDescendant(key)
  let parent = document.getParent(key)
  let index = parent.nodes.indexOf(descendant)
  let nodes = parent.nodes.splice(index + 1, 0, node)
  parent = parent.merge({ nodes })
  document = document.updateDescendant(parent)
  state = state.merge({ document })
  return state
}

/**
 * Insert a `node` before a node by `key`.
 *
 * @param {State} state
 * @param {String} key
 * @param {Node} node
 * @return {State}
 */

export function insertNodeBeforeNodeByKey(state, key, node) {
  let { document } = state
  let descendant = document.assertDescendant(key)
  let parent = document.getParent(key)
  let index = parent.nodes.indexOf(descendant)
  let nodes = parent.nodes.splice(index, 0, node)
  parent = parent.merge({ nodes })
  document = document.updateDescendant(parent)
  state = state.merge({ document })
  return state
}
