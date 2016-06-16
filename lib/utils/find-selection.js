
import findOffsetKey from './find-offset-key'

/**
 * Offset key splitter.
 */

const SPLITTER = /^(\w+)(?:\.(\d+)-(\d+))?$/

/**
 * Find the selection anchor properties from a `node`.
 *
 * @param {Node} node
 * @param {Number} nodeOffset
 * @return {Object} anchor
 *   @property {String} anchorKey
 *   @property {Number} anchorOffset
 */

export default function findSelection(node, nodeOffset) {
  const offsetKey = findOffsetKey(node)
  if (!offsetKey) return null

  const matches = SPLITTER.exec(offsetKey)
  if (!matches) throw new Error(`Unknown offset key "${offsetKey}".`)

  let [ all, key, offsetStart, offsetEnd ] = matches
  offsetStart = parseInt(offsetStart, 10)
  offsetEnd = parseInt(offsetEnd, 10)

  return {
    key: key,
    offset: offsetStart + nodeOffset
  }
}
