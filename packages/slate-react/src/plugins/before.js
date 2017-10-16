
import Debug from 'debug'
import { findDOMNode } from 'react-dom'

import findClosestNode from '../utils/find-closest-node'
import { SUPPORTED_EVENTS } from '../constants/environment'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:core:before')

/**
 * The core before plugin.
 *
 * @param {Object} options
 *   @property {Element} placeholder
 *   @property {String} placeholderClassName
 *   @property {Object} placeholderStyle
 * @return {Object}
 */

function BeforePlugin(options = {}) { // eslint-disable-line padded-blocks

  /**
   * On before input.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBeforeInput(event, data, change, editor) {
    if (editor.props.readOnly) return true
    if (isInEditor(event.target, editor)) return true

    // COMPAT: React's `onBeforeInput` synthetic event is based on the native
    // `keypress` and `textInput` events. In browsers that support the native
    // `beforeinput` event, we instead use that event to trigger text insertion,
    // since it provides more useful information about the range being affected
    // and also preserves compatibility with iOS autocorrect, which would be
    // broken if we called `preventDefault()` on React's synthetic event here.
    if (SUPPORTED_EVENTS.beforeinput) return true
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeInput,
  }
}

/**
 * Check if an `element` is fired from within the editable `editor` element.
 * This should be false for edits happening in non-contenteditable children,
 * such as void nodes and other nested Slate editors.
 *
 * @param {Element} element
 * @param {Editor} editor
 * @return {Boolean}
 */

function isInEditor(element, editor) {
  const editorEl = findDOMNode(editor)
  // COMPAT: Text nodes don't have `isContentEditable` property. So, when
  // `element` is a text node use its parent node for check.
  const el = element.nodeType == 3 ? element.parentNode : element
  return (
    (el.isContentEditable) &&
    (el == editorEl || findClosestNode(el, '[data-slate-editor]') == editorEl)
  )
}

/**
 * Export.
 *
 * @type {Object}
 */

export default BeforePlugin
