"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Find the DOM node for a `node`.
 *
 * @param {Node} node
 * @return {Element}
 */

function findDOMNode(node) {
  var el = window.document.querySelector("[data-key=\"" + node.key + "\"]");

  if (!el) {
    throw new Error("Unable to find a DOM node for \"" + node.key + "\". This is often because of forgetting to add `props.attributes` to a component returned from `renderNode`.");
  }

  return el;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = findDOMNode;