'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require('react-dom');

/**
 * Get clipboard HTML data by capturing the HTML inserted by the browser's
 * native paste action. To make this work, `preventDefault()` may not be
 * called on the `onPaste` event. As this method is asynchronous, a callback
 * is needed to return the HTML content. This solution was adapted from
 * http://stackoverflow.com/a/6804718.
 *
 * @param {Component} component
 * @param {Function} callback
 */

function getHtmlFromNativePaste(component, callback) {
  var el = (0, _reactDom.findDOMNode)(component);

  // Create an off-screen clone of the element and give it focus.
  var clone = el.cloneNode();
  clone.setAttribute('class', '');
  clone.setAttribute('style', 'position: fixed; left: -9999px');
  el.parentNode.insertBefore(clone, el);
  clone.focus();

  // Tick forward so the native paste behaviour occurs in cloned element and we
  // can get what was pasted from the DOM.
  setTimeout(function () {
    if (clone.childElementCount > 0) {
      // If the node contains any child nodes, that is the HTML content.
      var html = clone.innerHTML;
      clone.parentNode.removeChild(clone);
      callback(html);
    } else {
      // Only plain text, no HTML.
      callback();
    }
  }, 0);
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = getHtmlFromNativePaste;