'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

var _selectionIsBackward = require('selection-is-backward');

var _selectionIsBackward2 = _interopRequireDefault(_selectionIsBackward);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Scroll the current selection's focus point into view if needed.
 *
 * @param {Selection} selection
 */

function scrollToSelection(selection) {
  if (!selection.anchorNode) return;

  var window = (0, _getWindow2.default)(selection.anchorNode);
  var backward = (0, _selectionIsBackward2.default)(selection);
  var range = selection.getRangeAt(0);
  var rect = range.getBoundingClientRect();
  var innerWidth = window.innerWidth,
      innerHeight = window.innerHeight,
      pageYOffset = window.pageYOffset,
      pageXOffset = window.pageXOffset;

  var top = (backward ? rect.top : rect.bottom) + pageYOffset;
  var left = (backward ? rect.left : rect.right) + pageXOffset;

  var x = left < pageXOffset || innerWidth + pageXOffset < left ? left - innerWidth / 2 : pageXOffset;

  var y = top < pageYOffset || innerHeight + pageYOffset < top ? top - innerHeight / 2 : pageYOffset;

  window.scrollTo(x, y);
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = scrollToSelection;