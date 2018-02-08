import { Node, Value } from 'slate'
import { atob, btoa } from 'isomorphic-base64'

/**
 * Encode a JSON `object` as base-64 `string`.
 *
 * @param {Object} object
 * @return {String}
 */

function encode(object) {
  const string = JSON.stringify(object)
  const encoded = btoa(encodeURIComponent(string))
  return encoded
}

/**
 * Decode a base-64 `string` to a JSON `object`.
 *
 * @param {String} string
 * @return {Object}
 */

function decode(string) {
  const decoded = decodeURIComponent(atob(string))
  const object = JSON.parse(decoded)
  return object
}

/**
 * Deserialize a Value `string`.
 *
 * @param {String} string
 * @return {Value}
 */

function deserialize(string, options) {
  const raw = decode(string)
  const value = Value.fromJSON(raw, options)
  return value
}

/**
 * Deserialize a Node `string`.
 *
 * @param {String} string
 * @return {Node}
 */

function deserializeNode(string, options) {
  const raw = decode(string)
  const node = Node.fromJSON(raw, options)
  return node
}

/**
 * Serialize a `value`.
 *
 * @param {Value} value
 * @return {String}
 */

function serialize(value, options) {
  const raw = value.toJSON(options)
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
  const raw = node.toJSON(options)
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
  serializeNode,
}
