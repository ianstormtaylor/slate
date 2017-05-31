'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

/**
 * Data.
 *
 * This isn't an immutable record, it's just a thin wrapper around `Map` so that
 * we can allow for more convenient creation.
 *
 * @type {Object}
 */

var Data = {

  /**
   * Create a new `Data` with `properties`.
   *
   * @param {Object} properties
   * @return {Data} data
   */

  create: function create() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return _immutable.Map.isMap(properties) ? properties : new _immutable.Map(properties);
  }
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Data;