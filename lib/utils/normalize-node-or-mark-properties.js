
import Data from '../models/data'
import typeOf from 'type-of'

/**
 * Normalize the `properties` of a node or mark, which can be either a type
 * string or a dictionary of properties. If it's a dictionary, `data` is
 * optional and shouldn't be set if null or undefined.
 *
 * @param {String or Object} properties
 * @return {Object}
 */

function normalizeNodeOrMarkProperties(properties = {}) {
  const ret = {}
  const type = typeOf(properties)

  switch (type) {
    case 'string': {
      ret.type = properties
      break
    }
    case 'object': {
      for (const key in properties) {
        if (key == 'data') {
          if (properties[key] != null) ret[key] = Data.create(properties[key])
        } else {
          ret[key] = properties[key]
        }
      }
      break
    }
    default: {
      throw new Error(`A \`properties\` argument must be an object or a string, but you passed: "${type}".`)
    }
  }

  return ret
}

/**
 * Export.
 *
 * @type {Function}
 */

export default normalizeNodeOrMarkProperties
