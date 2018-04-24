'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Extends a DOM `selection` to a given `el` and `offset`.
 *
 * COMPAT: In IE11, `selection.extend` doesn't exist natively, so we have to
 * polyfill it with this. (2017/09/06)
 *
 * https://gist.github.com/tyler-johnson/0a3e8818de3f115b2a2dc47468ac0099
 *
 * @param {Selection} selection
 * @param {Element} el
 * @param {Number} offset
 * @return {Selection}
 */

function extendSelection(selection, el, offset) {
  // Use native method whenever possible.
  if (typeof selection.extend === 'function') {
    return selection.extend(el, offset);
  }

  var range = document.createRange();
  var anchor = document.createRange();
  var focus = document.createRange();
  anchor.setStart(selection.anchorNode, selection.anchorOffset);
  focus.setStart(el, offset);

  var v = focus.compareBoundaryPoints(window.Range.START_TO_START, anchor);

  // If the focus is after the anchor...
  if (v >= 0) {
    range.setStart(selection.anchorNode, selection.anchorOffset);
    range.setEnd(el, offset);
  }

  // Otherwise, if the anchor if after the focus...
  else {
      range.setStart(el, offset);
      range.setEnd(selection.anchorNode, selection.anchorOffset);
    }

  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = extendSelection;