
import normalizeProperties from '../utils/normalize-node-or-mark-properties'

/**
 * Remove a node by `key`.
 *
 * @param {State} state
 * @param {String} key
 * @return {State} state
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
 * @return {State} state
 */

export function setNodeByKey(state, key, properties) {
  properties = normalizeProperties(properties)
  let { document } = state
  let descendant = document.assertDescendant(key)
  descendant = descendant.merge(properties)
  document = document.updateDescendant(descendant)
  state = state.merge({ document })
  return state
}
