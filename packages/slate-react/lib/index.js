'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDOMNode = exports.Placeholder = exports.Editor = undefined;

var _editor = require('./components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _placeholder = require('./components/placeholder');

var _placeholder2 = _interopRequireDefault(_placeholder);

var _findDomNode = require('./utils/find-dom-node');

var _findDomNode2 = _interopRequireDefault(_findDomNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Export.
 *
 * @type {Object}
 */

exports.Editor = _editor2.default;
exports.Placeholder = _placeholder2.default;
exports.findDOMNode = _findDomNode2.default;

/**
 * Utils.
 */

/**
 * Components.
 */

exports.default = {
  Editor: _editor2.default,
  Placeholder: _placeholder2.default,
  findDOMNode: _findDomNode2.default
};