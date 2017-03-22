'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scrollWrapperElements(element, options) {
  var window = (0, _getWindow2.default)(element);
  var elementRect = element.getBoundingClientRect();
  var wrapper = element.parentNode;

  while (wrapper != window.document.body) {
    var wrapperRect = wrapper.getBoundingClientRect();
    var margin = options.margin;
    var deltaX = 0;
    var deltaY = 0;

    if (elementRect.top < wrapperRect.top + margin) {
      deltaY = elementRect.top - wrapperRect.top - margin;
    } else if (elementRect.bottom > wrapperRect.bottom - margin) {
      deltaY = elementRect.bottom - wrapperRect.bottom + margin;
    }
    if (elementRect.left < wrapperRect.left + margin) {
      deltaX = elementRect.left - wrapperRect.left - margin;
    } else if (elementRect.right > wrapperRect.right - margin) {
      deltaX = elementRect.right - wrapperRect.right + margin;
    }
    wrapper.scrollTop += deltaY;
    wrapper.scrollLeft += deltaX;
    wrapper = wrapper.parentNode;
  }

  return elementRect;
}
/**
 * Copied from `element-scroll-to`, but edited to account for `window` being
 * inside of iframes.
 *
 * https://github.com/webmodules/element-scroll-to
 */

function scrollWindow(element, options, elementRect) {
  var window = (0, _getWindow2.default)(element);
  var margin = options.margin;
  var deltaX = 0;
  var deltaY = 0;

  if (elementRect.top < 0 + margin) {
    deltaY = elementRect.top - margin;
  } else if (elementRect.bottom > window.innerHeight - margin) {
    deltaY = elementRect.bottom - window.innerHeight + margin;
  }
  if (elementRect.left < 0 + margin) {
    deltaX = elementRect.left - margin;
  } else if (elementRect.right > window.innerWidth - margin) {
    deltaX = elementRect.right - window.innerWidth + margin;
  }

  window.scrollBy(deltaX, deltaY);
}

function scrollTo(element, options) {
  options = options || {};
  options.margin = options.margin || 0;
  var rect = scrollWrapperElements(element, options);
  scrollWindow(element, options, rect);
}

exports.default = scrollTo;