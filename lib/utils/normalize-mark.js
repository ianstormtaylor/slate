
import Mark from '../models/mark'
import typeOf from 'type-of'
import normalizeProperties from './normalize-node-or-mark-properties'

/**
 * Normalize a `mark` argument, which can be a string or plain object too.
 *
 * @param {Mark or String or Object} mark
 * @return {Mark}
 */

function normalizeMark(mark) {
  if (mark instanceof Mark) return mark

  const type = typeOf(mark)

  switch (type) {
    case 'string':
    case 'object': {
      return Mark.create(normalizeProperties(mark))
    }
    default: {
      throw new Error(`A \`mark\` argument must be a mark, an object or a string, but you passed: "${type}".`)
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default normalizeMark
