'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _normalizeNodeAndOffset = require('./normalize-node-and-offset');

var _normalizeNodeAndOffset2 = _interopRequireDefault(_normalizeNodeAndOffset);

var _findClosestNode = require('./find-closest-node');

var _findClosestNode2 = _interopRequireDefault(_findClosestNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Offset key parser regex.
 *
 * @type {RegExp}
 */

var PARSER = /^(\w+)(?:-(\d+))?$/;

/**
 * Offset key attribute name.
 *
 * @type {String}
 */

var ATTRIBUTE = 'data-offset-key';

/**
 * Offset key attribute selector.
 *
 * @type {String}
 */

var SELECTOR = '[' + ATTRIBUTE + ']';

/**
 * Void node selection.
 *
 * @type {String}
 */

var VOID_SELECTOR = '[data-slate-void]';

/**
 * Find the start and end bounds from an `offsetKey` and `ranges`.
 *
 * @param {Number} index
 * @param {List<Range>} ranges
 * @return {Object}
 */

function findBounds(index, ranges) {
  var range = ranges.get(index);
  var start = ranges.slice(0, index).reduce(function (memo, r) {
    return memo += r.text.length;
  }, 0);

  return {
    start: start,
    end: start + range.text.length
  };
}

/**
 * From a DOM node, find the closest parent's offset key.
 *
 * @param {Element} rawNode
 * @param {Number} rawOffset
 * @return {Object}
 */

function findKey(rawNode, rawOffset) {
  var _normalizeNodeAndOffs = (0, _normalizeNodeAndOffset2.default)(rawNode, rawOffset),
      node = _normalizeNodeAndOffs.node,
      offset = _normalizeNodeAndOffs.offset;

  var parentNode = node.parentNode;

  // Find the closest parent with an offset key attribute.

  var closest = (0, _findClosestNode2.default)(parentNode, SELECTOR);

  // For void nodes, the element with the offset key will be a cousin, not an
  // ancestor, so find it by going down from the nearest void parent.
  if (!closest) {
    var closestVoid = (0, _findClosestNode2.default)(parentNode, VOID_SELECTOR);
    if (!closestVoid) return null;
    closest = closestVoid.querySelector(SELECTOR);
    offset = closest.textContent.length;
  }

  // Get the string value of the offset key attribute.
  var offsetKey = closest.getAttribute(ATTRIBUTE);

  // If we still didn't find an offset key, abort.
  if (!offsetKey) return null;

  // Return the parsed the offset key.
  var parsed = parse(offsetKey);
  return {
    key: parsed.key,
    index: parsed.index,
    offset: offset
  };
}

/**
 * Find the selection point from an `offsetKey` and `ranges`.
 *
 * @param {Object} offsetKey
 * @param {List<Range>} ranges
 * @return {Object}
 */

function findPoint(offsetKey, ranges) {
  var key = offsetKey.key,
      index = offsetKey.index,
      offset = offsetKey.offset;

  var _findBounds = findBounds(index, ranges),
      start = _findBounds.start,
      end = _findBounds.end;

  // Don't let the offset be outside of the start and end bounds.


  offset = start + offset;
  offset = Math.max(offset, start);
  offset = Math.min(offset, end);

  return {
    key: key,
    index: index,
    start: start,
    end: end,
    offset: offset
  };
}

/**
 * Parse an offset key `string`.
 *
 * @param {String} string
 * @return {Object}
 */

function parse(string) {
  var matches = PARSER.exec(string);
  if (!matches) throw new Error('Invalid offset key string "' + string + '".');

  var _matches = _slicedToArray(matches, 3),
      original = _matches[0],
      key = _matches[1],
      index = _matches[2]; // eslint-disable-line no-unused-vars


  return {
    key: key,
    index: parseInt(index, 10)
  };
}

/**
 * Stringify an offset key `object`.
 *
 * @param {Object} object
 *   @property {String} key
 *   @property {Number} index
 * @return {String}
 */

function stringify(object) {
  return object.key + '-' + object.index;
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = {
  findBounds: findBounds,
  findKey: findKey,
  findPoint: findPoint,
  parse: parse,
  stringify: stringify
};