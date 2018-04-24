'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Set `properties` on the top-level state's data.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.setData = function (change, properties) {
  var state = change.state;
  var data = state.data;


  change.applyOperation({
    type: 'set_data',
    properties: properties,
    data: data
  });
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;