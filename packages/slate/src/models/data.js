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

class Data {
  /**
   * Create a new `Data` with `attrs`.
   *
   * @param {Object|Data|Map} attrs
   * @return {Data} data
   */

  static create(attrs = {}) {
    if (Map.isMap(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Data.fromJSON(attrs)
    }

    throw new Error(
      `\`Data.create\` only accepts objects or maps, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Data` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Data}
   */

  static fromJSON(object) {
    return new Map(object)
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Data.fromJSON
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Data
