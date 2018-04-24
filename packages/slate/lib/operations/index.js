'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apply = require('./apply');

var _apply2 = _interopRequireDefault(_apply);

var _invert = require('./invert');

var _invert2 = _interopRequireDefault(_invert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = {
  apply: _apply2.default,
  invert: _invert2.default
};