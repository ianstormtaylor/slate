
import OffsetKey from './offset-key'

/**
 * Get a point from a native selection's DOM `element` and `offset`.
 *
 * @param {Element} element
 * @param {Number} offset
 * @param {State} state
 * @param {Editor} editor
 * @return {Object}
 */

function getPoint(element, offset, state, editor) {
  const { document } = state
  const schema = editor.getSchema()

  // If we can't find an offset key, we can't get a point.
  const offsetKey = OffsetKey.findKey(element, offset)
  if (!offsetKey) return null

  // COMPAT: If someone is clicking from one Slate editor into another, the
  // select event fires two, once for the old editor's `element` first, and
  // then afterwards for the correct `element`. (2017/03/03)
  const { key } = offsetKey
  const node = document.getDescendant(key)
  if (!node) return null

  const decorators = document.getDescendantDecorators(key, schema)
  const ranges = node.getRanges(decorators)
  const point = OffsetKey.findPoint(offsetKey, ranges)
  return point
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getPoint
