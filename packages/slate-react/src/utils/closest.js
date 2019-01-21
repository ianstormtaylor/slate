/**
 * Returns the closest element that matches the selector.
 * Unlike the native `Element.closest` method, this doesn't require the
 * starting node to be an Element.
 * 
 * @param  {Node} node to start at
 * @param  {String} css selector to match
 * @return {Element} the closest matching element
 */

export default function closest(node, selector) {
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode
  }
  return node.closest(selector)
}
