"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Check if an `object` is a React component.
 *
 * @param {Object} object
 * @return {Boolean}
 */

function isReactComponent(object) {
  return object && object.prototype && object.prototype.isReactComponent;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = isReactComponent;