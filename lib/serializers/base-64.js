
import Raw from './raw'

/**
 * Encode a JSON `object` as base-64 `string`.
 *
 * @param {Object} object
 * @return {String} encoded
 */

function encode(object) {
  const string = JSON.stringify(object)
  const encoded = window.btoa(window.encodeURIComponent(string))
  return encoded
}

/**
 * Decode a base-64 `string` to a JSON `object`.
 *
 * @param {String} string
 * @return {Object} object
 */

function decode(string) {
  const decoded = window.decodeURIComponent(window.atob(string))
  const object = JSON.parse(decoded)
  return object
}

/**
 * Deserialize a State `string`.
 *
 * @param {String} string
 * @return {State} state
 */

function deserialize(string) {
  const raw = decode(string)
  const state = Raw.deserialize(raw)
  return state
}

/**
 * Deserialize a Node `string`.
 *
 * @param {String} string
 * @return {Node} node
 */

function deserializeNode(string) {
  const raw = decode(string)
  const node = Raw.deserializeNode(raw)
  return node
}

/**
 * Serialize a `state`.
 *
 * @param {State} state
 * @return {String} encoded
 */

function serialize(state) {
  const raw = Raw.serialize(state)
  const encoded = encode(raw)
  return encoded
}

/**
 * Serialize a `node`.
 *
 * @param {Node} node
 * @return {String} encoded
 */

function serializeNode(node) {
  const raw = Raw.serializeNode(node)
  const encoded = encode(raw)
  return encoded
}

/**
 * Export.
 */

export default {
  deserialize,
  deserializeNode,
  serialize,
  serializeNode
}
