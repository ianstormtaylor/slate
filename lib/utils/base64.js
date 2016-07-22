
/**
 * Encode a `string` as Base64.
 *
 * @param {String} string
 * @return {String}
 */

function encode(string) {
  return window.btoa(window.unescape(window.encodeURIComponent(string)))
}

/**
 * Decode a `string` as Base64.
 *
 * @param {String} string
 * @return {String}
 */

function decode(string) {
  return window.decodeURIComponent(window.escape(window.atob(string)))
}

/**
 * Export.
 */

export default {
  encode,
  decode
}
