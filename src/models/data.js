
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
   * Create a new `Data` with `properties`.
   *
   * @param {Object} properties
   * @return {Data} data
   */

  create(properties = {}) {
    return Map.isMap(properties)
      ? properties
      : new Map(properties)
  }

}

/**
 * Export.
 *
 * @type {Object}
 */

export default Data
