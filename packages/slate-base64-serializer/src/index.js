
import { State } from 'slate'

function bufferFrom(data, encoding, len) {
  if (Buffer.from) {
    return Buffer.from(data, encoding, len)
  }
  return new Buffer(data, encoding, len)
}

/**
 * encode string `str` to base64
 *
 * @param  {String} str
 * @return {String}
 */

function btoa(str) {
  let buffer
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(str)
  }

  if (str instanceof Buffer) {
    buffer = str
  } else {
    buffer = bufferFrom(str)
  }
  return buffer.toString('base64')
}

/**
 * decode back base64-encoded string `str`
 *
 * @param  {String} str
 * @return {String}
 */

function atob(str) {
  let buffer
  if (typeof window !== 'undefined'  && window.atob) {
    return window.atob(str)
  }
  return bufferFrom(str, 'base64').toString('binary')
}

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
 * Deserialize a State `string`.
 *
 * @param {String} string
 * @return {State}
 */

function deserialize(string, options) {
  const raw = decode(string)
  const state = State.fromJSON(raw, options)
  return state
}

/**
 * Deserialize a Node `string`.
 *
 * @param {String} string
 * @return {Node}
 */

function deserializeNode(string, options) {
  const { Node } = require('slate')
  const raw = decode(string)
  const node = Node.fromJSON(raw, options)
  return node
}

/**
 * Serialize a `state`.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state, options) {
  const raw = state.toJSON(options)
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
  serializeNode
}
