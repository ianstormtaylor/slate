import { findDOMNode } from 'react-dom'

/**
 * Get clipboard HTML data by capturing the HTML inserted by the browser's
 * native paste action. To make this work, `preventDefault()` may not be
 * called on the `onPaste` event. If pasted HTML can be retreived, it is
 * added to the given `data` object, setting the `type` to `html`. As this
 * method is asynchronous, a callback is needed to return the `data` object.
 * This solution was adapted from http://stackoverflow.com/a/6804718.
 *
 * @param {React.Component} component
 * @param {Object} data
 * @param {Function} callback
 */

function getHtmlFromNativePaste(component, data, callback) {
  const el = findDOMNode(component)

  // Clone contentedible element, move out of screen and set focus.
  const clone = el.cloneNode()
  clone.setAttribute('class', '')
  clone.setAttribute('style', 'position: fixed; left: -9999px')
  el.parentNode.insertBefore(clone, el)
  clone.focus()

  // Clear call stack to let native paste behaviour occur on cloned element,
  // then get what was pasted from the DOM and remove cloned element.
  setTimeout(() => {
    if (clone.childElementCount > 0) {
      // If the node contains any child nodes, that is the HTML content.
      const html = clone.innerHTML
      clone.parentNode.removeChild(clone)

      callback({ ...data, html, type: 'html' })
    } else {
      // Only plain text, no HTML.
      callback(data)
    }
  }, 0)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getHtmlFromNativePaste
