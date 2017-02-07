'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Is in development?
 *
 * @type {Boolean}
 */

var IS_DEV = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

/**
 * Export.
 *
 * @type {Boolean}
 */

exports.default = IS_DEV;