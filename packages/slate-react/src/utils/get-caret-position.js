
import findDeepestNode from './find-deepest-node'

/**
 * Get caret position from selection point.
 *
 * @param {String} key
 * @param {Number} offset
 * @param {State} state
 * @param {Editor} editor
 * @param {Element} el
 * @return {Object}
 */

function getCaretPosition(key, offset, state, editor, el) {
  const { document } = state
  const text = document.getDescendant(key)
  const schema = editor.getSchema()
  const decorators = document.getDescendantDecorators(key, schema)
  const ranges = text.getRanges(decorators)

  let a = 0
  let index
  let off

  ranges.forEach((range, i) => {
    const { length } = range.text
    a += length
    if (a < offset) return
    index = i
    off = offset - (a - length)
    return false
  })

  const span = el.querySelector(`[data-offset-key="${key}-${index}"]`)
  const node = findDeepestNode(span)
  return { node, offset: off }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getCaretPosition
