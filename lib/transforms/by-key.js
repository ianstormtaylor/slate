
import Normalize from '../utils/normalize'

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
  document = document.removeDescendant(key)
  document = document.normalize()
  state = state.merge({ document })
  transform.state = state
  return transform
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object or String} properties
 * @return {Transform}
 */

export function setNodeByKey(transform, key, properties) {
  properties = Normalize.nodeProperties(properties)
  let { state } = transform
  let { document } = state
  let descendant = document.assertDescendant(key)
  descendant = descendant.merge(properties)
  document = document.updateDescendant(descendant)
  state = state.merge({ document })
  transform.state = state
  return transform
}

/**
 * Insert a `node` after a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Node} node
 * @return {Transform}
 */

export function insertNodeAfterNodeByKey(transform, key, node) {
  let { state } = transform
  let { document } = state
  let descendant = document.assertDescendant(key)
  let parent = document.getParent(key)
  let index = parent.nodes.indexOf(descendant)
  let nodes = parent.nodes.splice(index + 1, 0, node)
  parent = parent.merge({ nodes })
  document = document.updateDescendant(parent)
  state = state.merge({ document })
  transform.state = state
  return transform
}

/**
 * Insert a `node` before a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Node} node
 * @return {Transform}
 */

export function insertNodeBeforeNodeByKey(transform, key, node) {
  let { state } = transform
  let { document } = state
  let descendant = document.assertDescendant(key)
  let parent = document.getParent(key)
  let index = parent.nodes.indexOf(descendant)
  let nodes = parent.nodes.splice(index, 0, node)
  parent = parent.merge({ nodes })
  document = document.updateDescendant(parent)
  state = state.merge({ document })
  transform.state = state
  return transform
}
