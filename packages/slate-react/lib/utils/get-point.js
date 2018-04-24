'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _offsetKey = require('./offset-key');

var _offsetKey2 = _interopRequireDefault(_offsetKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a point from a native selection's DOM `element` and `offset`.
 *
 * @param {Element} element
 * @param {Number} offset
 * @param {State} state
 * @param {Editor} editor
 * @return {Object}
 */

function getPoint(element, offset, state, editor) {
  var document = state.document;

  var schema = editor.getSchema();

  // If we can't find an offset key, we can't get a point.
  var offsetKey = _offsetKey2.default.findKey(element, offset);
  if (!offsetKey) return null;

  // COMPAT: If someone is clicking from one Slate editor into another, the
  // select event fires two, once for the old editor's `element` first, and
  // then afterwards for the correct `element`. (2017/03/03)
  var key = offsetKey.key;

  var node = document.getDescendant(key);
  if (!node) return null;

  var decorators = document.getDescendantDecorators(key, schema);
  var ranges = node.getRanges(decorators);
  var point = _offsetKey2.default.findPoint(offsetKey, ranges);
  return point;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = getPoint;