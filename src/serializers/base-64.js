
import Raw from './raw'

/**
 * Encode a JSON `object` as base-64 `string`.
 *
 * @param {Object} object
 * @return {String}
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
 * @return {Object}
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
 * @return {State}
 */

function deserialize(string, options) {
  const raw = decode(string)
  const state = Raw.deserialize(raw, options)
  return state
}

/**
 * Deserialize a Node `string`.
 *
 * @param {String} string
 * @return {Node}
 */

function deserializeNode(string, options) {
  const raw = decode(string)
  const node = Raw.deserializeNode(raw, options)
  return node
}

/**
 * Serialize a `state`.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state, options) {
  const raw = Raw.serialize(state, options)
  const encoded = encode(raw)
  return encoded
}

/**
 * Serialize a `node`.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node, options) {
  const raw = Raw.serializeNode(node, options)
  const encoded = encode(raw)
  return encoded
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  deserialize,
  deserializeNode,
  serialize,
  serializeNode
}
