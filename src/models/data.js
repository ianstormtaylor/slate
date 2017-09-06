
import isPlainObject from 'is-plain-object'
import { Map } from 'immutable'

/**
 * Data.
 *
 * This isn't an immutable record, it's just a thin wrapper around `Map` so that
 * we can allow for more convenient creation.
 *
 * @type {Object}
 */

const Data = {

  /**
   * Create a new `Data` with `attrs`.
   *
   * @param {Object|Data|Map} attrs
   * @return {Data} data
   */

  create(attrs = {}) {
    if (Map.isMap(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return new Map(attrs)
    }

    throw new Error(`\`Data.create\` only accepts objects or maps, but you passed it: ${attrs}`)
  }

}

/**
 * Export.
 *
 * @type {Object}
 */

export default Data
