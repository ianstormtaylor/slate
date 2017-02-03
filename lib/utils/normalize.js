'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _block = require('../models/block');

var _block2 = _interopRequireDefault(_block);

var _document = require('../models/document');

var _document2 = _interopRequireDefault(_document);

var _inline = require('../models/inline');

var _inline2 = _interopRequireDefault(_inline);

var _data = require('../models/data');

var _data2 = _interopRequireDefault(_data);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

var _selection = require('../models/selection');

var _selection2 = _interopRequireDefault(_selection);

var _text = require('../models/text');

var _text2 = _interopRequireDefault(_text);

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Normalize a block argument `value`.
 *
 * @param {Block|String|Object} value
 * @return {Block}
 */

function block(value) {
  if (value instanceof _block2.default) return value;

  switch ((0, _typeOf2.default)(value)) {
    case 'string':
    case 'object':
      return _block2.default.create(nodeProperties(value));

    default:
      throw new Error('Invalid `block` argument! It must be a block, an object, or a string. You passed: "' + value + '".');
  }
}

/**
 * Normalize an inline argument `value`.
 *
 * @param {Inline|String|Object} value
 * @return {Inline}
 */

function inline(value) {
  if (value instanceof _inline2.default) return value;

  switch ((0, _typeOf2.default)(value)) {
    case 'string':
    case 'object':
      return _inline2.default.create(nodeProperties(value));

    default:
      throw new Error('Invalid `inline` argument! It must be an inline, an object, or a string. You passed: "' + value + '".');
  }
}

/**
 * Normalize a key argument `value`.
 *
 * @param {String|Node} value
 * @return {String}
 */

function key(value) {
  if ((0, _typeOf2.default)(value) == 'string') return value;

  (0, _warn2.default)('An object was passed to a Node method instead of a `key` string. This was previously supported, but is being deprecated because it can have a negative impact on performance. The object in question was:', value);
  if (value instanceof _block2.default) return value.key;
  if (value instanceof _document2.default) return value.key;
  if (value instanceof _inline2.default) return value.key;
  if (value instanceof _text2.default) return value.key;

  throw new Error('Invalid `key` argument! It must be either a block, an inline, a text, or a string. You passed: "' + value + '".');
}

/**
 * Normalize a mark argument `value`.
 *
 * @param {Mark|String|Object} value
 * @return {Mark}
 */

function mark(value) {
  if (value instanceof _mark2.default) return value;

  switch ((0, _typeOf2.default)(value)) {
    case 'string':
    case 'object':
      return _mark2.default.create(markProperties(value));

    default:
      throw new Error('Invalid `mark` argument! It must be a mark, an object, or a string. You passed: "' + value + '".');
  }
}

/**
 * Normalize a mark properties argument `value`.
 *
 * @param {String|Object|Mark} value
 * @return {Object}
 */

function markProperties() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var ret = {};

  switch ((0, _typeOf2.default)(value)) {
    case 'string':
      ret.type = value;
      break;

    case 'object':
      for (var k in value) {
        if (k == 'data') {
          if (value[k] !== undefined) ret[k] = _data2.default.create(value[k]);
        } else {
          ret[k] = value[k];
        }
      }
      break;

    default:
      throw new Error('Invalid mark `properties` argument! It must be an object, a string or a mark. You passed: "' + value + '".');
  }

  return ret;
}

/**
 * Normalize a node properties argument `value`.
 *
 * @param {String|Object|Node} value
 * @return {Object}
 */

function nodeProperties() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var ret = {};

  switch ((0, _typeOf2.default)(value)) {
    case 'string':
      ret.type = value;
      break;

    case 'object':
      if (value.isVoid !== undefined) ret.isVoid = !!value.isVoid;
      for (var k in value) {
        if (k == 'data') {
          if (value[k] !== undefined) ret[k] = _data2.default.create(value[k]);
        } else {
          ret[k] = value[k];
        }
      }
      break;

    default:
      throw new Error('Invalid node `properties` argument! It must be an object, a string or a node. You passed: "' + value + '".');
  }

  return ret;
}

/**
 * Normalize a selection argument `value`.
 *
 * @param {Selection|Object} value
 * @return {Selection}
 */

function selection(value) {
  if (value instanceof _selection2.default) return value;

  switch ((0, _typeOf2.default)(value)) {
    case 'object':
      return _selection2.default.create(value);

    default:
      throw new Error('Invalid `selection` argument! It must be a selection or an object. You passed: "' + value + '".');
  }
}

/**
 * Normalize a selection properties argument `value`.
 *
 * @param {Object|Selection} value
 * @return {Object}
 */

function selectionProperties() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var ret = {};

  switch ((0, _typeOf2.default)(value)) {
    case 'object':
      if (value.anchorKey !== undefined) ret.anchorKey = value.anchorKey;
      if (value.anchorOffset !== undefined) ret.anchorOffset = value.anchorOffset;
      if (value.focusKey !== undefined) ret.focusKey = value.focusKey;
      if (value.focusOffset !== undefined) ret.focusOffset = value.focusOffset;
      if (value.isBackward !== undefined) ret.isBackward = !!value.isBackward;
      if (value.isFocused !== undefined) ret.isFocused = !!value.isFocused;
      if (value.marks !== undefined) ret.marks = value.marks;
      break;

    default:
      throw new Error('Invalid selection `properties` argument! It must be an object or a selection. You passed: "' + value + '".');
  }

  return ret;
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = {
  block: block,
  inline: inline,
  key: key,
  mark: mark,
  markProperties: markProperties,
  nodeProperties: nodeProperties,
  selection: selection,
  selectionProperties: selectionProperties
};