'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _findDeepestNode = require('./find-deepest-node');

var _findDeepestNode2 = _interopRequireDefault(_findDeepestNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get caret position from selection point.
 *
 * @param {String} key
 * @param {Number} offset
 * @param {State} state
 * @param {Editor} editor
 * @param {Element} el
 * @return {Object}
 */

function getCaretPosition(key, offset, state, editor, el) {
  var document = state.document;

  var text = document.getDescendant(key);
  var schema = editor.getSchema();
  var decorators = document.getDescendantDecorators(key, schema);
  var ranges = text.getRanges(decorators);

  var a = 0;
  var index = void 0;
  var off = void 0;

  ranges.forEach(function (range, i) {
    var length = range.text.length;

    a += length;
    if (a < offset) return;
    index = i;
    off = offset - (a - length);
    return false;
  });

  var span = el.querySelector('[data-offset-key="' + key + '-' + index + '"]');
  var node = (0, _findDeepestNode2.default)(span);
  return { node: node, offset: off };
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = getCaretPosition;