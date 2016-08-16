
import Inline from '../models/inline'
import normalizeProperties from './normalize-node-or-mark-properties'
import typeOf from 'type-of'

/**
 * Normalize an `inline` argument, which can be a string or plain object too.
 *
 * @param {Inline or String or Object} inline
 * @return {Inline}
 */

function normalizeInline(inline) {
  if (inline instanceof Inline) return inline

  const type = typeOf(inline)

  switch (type) {
    case 'string':
    case 'object': {
      return Inline.create(normalizeProperties(inline))
    }
    default: {
      throw new Error(`An \`inline\` argument must be an inline, an object or a string, but you passed: "${type}".`)
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default normalizeInline
