
/**
 * Create an offset key from a `node` and a `range`.
 *
 * @param {Node} node
 * @param {Object} range
 *   @property {Number} offset
 *   @property {String} text
 * @return {String} offsetKey
 */

export default function createOffsetKey(node, range) {
  const start = range.offset
  const end = range.offset + range.text.length
  return `${node.key}.${start}-${end}`
}
