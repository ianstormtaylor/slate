
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
   * @param {Object} attrs
   * @return {Data} data
   */

  create(attrs = {}) {
    return Map.isMap(attrs)
      ? attrs
      : new Map(attrs)
  }

}

/**
 * Export.
 *
 * @type {Object}
 */

export default Data
