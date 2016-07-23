
import Raw from '../serializers/raw'

/**
 * Serialize a `string` as Base64.
 *
 * @param {Document} fragment
 * @return {String} encoded
 */

function serialize(fragment) {
  const raw = Raw.serializeNode(fragment)
  const string = JSON.stringify(raw)
  const encoded = window.btoa(window.unescape(window.encodeURIComponent(string)))
  return encoded
}

/**
 * Deserialize a `fragment` as Base64.
 *
 * @param {String} encoded
 * @return {Document} fragment
 */

function deserialize(encoded) {
  const string = window.decodeURIComponent(window.escape(window.atob(encoded)))
  const json = JSON.parse(string)
  const state = Raw.deserialize(json)
  return state.document
}

/**
 * Export.
 */

export default {
  serialize,
  deserialize
}
