'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scrollWindow(window, cursorTop, cursorLeft, cursorHeight) {
  var scrollX = window.scrollX;
  var scrollY = window.scrollY;
  var cursorBottom = cursorTop + cursorHeight;

  if (cursorTop < 0 || cursorBottom > window.innerHeight) {
    scrollY += cursorTop - window.innerHeight / 2 + cursorHeight / 2;
  }

  if (cursorLeft < 0 || cursorLeft > window.innerWidth) {
    scrollX += cursorLeft - window.innerWidth / 2;
  }

  window.scrollTo(scrollX, scrollY);
}
/**
 * Helps scroll the cursor into the middle of view if it isn't in view
 */

function scrollTo(element) {
  var window = (0, _getWindow2.default)(element);
  var s = window.getSelection();
  if (s.rangeCount > 0) {
    var selectionRect = s.getRangeAt(0).getBoundingClientRect();
    var innerRect = selectionRect;
    var wrapper = element;
    var cursorHeight = innerRect.height;
    var cursorTop = innerRect.top;
    var cursorLeft = innerRect.left;

    while (wrapper != window.document.body) {
      var wrapperRect = wrapper.getBoundingClientRect();
      var currentY = cursorTop;
      var cursorBottom = cursorTop + cursorHeight;
      if (cursorTop < wrapperRect.top || cursorBottom > wrapperRect.top + wrapper.offsetHeight) {
        cursorTop = wrapperRect.top + wrapperRect.height / 2 - cursorHeight / 2;
        wrapper.scrollTop += currentY - cursorTop;
      }

      var currentLeft = cursorLeft;
      if (cursorLeft < wrapperRect.left || cursorLeft > wrapperRect.right) {
        cursorLeft = wrapperRect.left + wrapperRect.width / 2;
        wrapper.scrollLeft += currentLeft - cursorLeft;
      }

      innerRect = wrapperRect;
      wrapper = wrapper.parentNode;
    }

    scrollWindow(window, cursorTop, cursorLeft, cursorHeight);
  }
}

exports.default = scrollTo;