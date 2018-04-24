"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Find the deepest descendant of a DOM `element`.
 *
 * @param {Element} node
 * @return {Element}
 */

function findDeepestNode(element) {
  return element.firstChild ? findDeepestNode(element.firstChild) : element;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = findDeepestNode;