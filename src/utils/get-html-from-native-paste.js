import { findDOMNode } from 'react-dom'

/**
 * Get clipboard html data by capturing the html inserted by the browser's native paste action.
 *
 * To make this work, `preventDefault()` may not be called on the `onPaste` event.
 * If pasted html can be retreived, it is added to the given `data` object, setting the `type` to `html`.
 * As this method is asynchronous, a callback is needed to return the `data` object.
 *
 * Solution adapted from http://stackoverflow.com/a/6804718).
 *
 * @param {React.Component} component
 * @param {Object} data
 * @param {Function} callback
 */

function getHtmlFromNativePaste(component, data, callback) {
  const contentNode = findDOMNode(component)

  const clipboardNode = contentNode.cloneNode()
  clipboardNode.setAttribute('class', '')
  clipboardNode.setAttribute('style', 'position: fixed; left: -9999px')

  contentNode.parentNode.insertBefore(clipboardNode, contentNode)

  clipboardNode.focus()

  // Clear call stack to let native paste behaviour occur, then get what was pasted from the DOM
  setTimeout(() => {
    if (clipboardNode.childElementCount > 0) {
      // If contains any child nodes, that is the html content
      const html = clipboardNode.innerHTML
      clipboardNode.parentNode.removeChild(clipboardNode)

      callback({ ...data, html, type: 'html' })
    } else {
      // Only plain text, no html
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
