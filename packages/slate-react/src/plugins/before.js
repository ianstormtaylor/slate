
import Debug from 'debug'
import getWindow from 'get-window'
import { findDOMNode } from 'react-dom'

import HOTKEYS from '../constants/hotkeys'
import { IS_FIREFOX, SUPPORTED_EVENTS } from '../constants/environment'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:core:before')

/**
 * The core before plugin.
 *
 * @return {Object}
 */

function BeforePlugin() {
  let compositionCount = 0
  let isComposing = false
  let isCopying = false
  let isDragging = false

  /**
   * On before input.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBeforeInput(event, change, editor) {
    if (editor.props.readOnly) return true

    // COMPAT: React's `onBeforeInput` synthetic event is based on the native
    // `keypress` and `textInput` events. In browsers that support the native
    // `beforeinput` event, we instead use that event to trigger text insertion,
    // since it provides more useful information about the range being affected
    // and also preserves compatibility with iOS autocorrect, which would be
    // broken if we called `preventDefault()` on React's synthetic event here.
    if (SUPPORTED_EVENTS.beforeinput) return true

    debug('onBeforeInput', { event })
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBlur(event, change, editor) {
    if (isCopying) return true
    if (editor.props.readOnly) return true

    // If the active element is still the editor, the blur event is due to the
    // window itself being blurred (eg. when changing tabs) so we should ignore
    // the event, since we want to maintain focus when returning.
    const el = findDOMNode(editor)
    const window = getWindow(el)
    if (window.document.activeElement == el) return true

    debug('onBlur', { event })
  }

  /**
   * On composition end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCompositionEnd(event, change, editor) {
    const n = compositionCount

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition is still in affect.
    setTimeout(() => {
      if (compositionCount > n) return
      isComposing = false
    })

    debug('onCompositionEnd', { event })
  }

  /**
   * On composition start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCompositionStart(event, change, editor) {
    isComposing = true
    compositionCount++

    debug('onCompositionStart', { event })
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCopy(event, change, editor) {
    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => isCopying = false)

    debug('onCopy', { event })
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCut(event, change, editor) {
    if (editor.props.readOnly) return true

    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => isCopying = false)

    debug('onCut', { event })
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragEnd(event, change, editor) {
    // Stop propagation so the event isn't visible to parent editors.
    event.stopPropagation()

    isDragging = false

    debug('onDragEnd', { event })
  }

  /**
   * On drag enter.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragEnter(event, change, editor) {
    // Stop propagation so the event isn't visible to parent editors.
    event.stopPropagation()

    debug('onDragEnter', { event })
  }

  /**
   * On drag exit.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragExit(event, change, editor) {
    // Stop propagation so the event isn't visible to parent editors.
    event.stopPropagation()

    debug('onDragExit', { event })
  }

  /**
   * On drag leave.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragLeave(event, change, editor) {
    // Stop propagation so the event isn't visible to parent editors.
    event.stopPropagation()

    debug('onDragLeave', { event })
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragOver(event, change, editor) {
    // Stop propagation so the event isn't visible to parent editors.
    event.stopPropagation()

    // If a drag is already in progress, don't do this again.
    if (!isDragging) return true

    isDragging = true
    event.nativeEvent.dataTransfer.dropEffect = 'move'

    // You must call `preventDefault` to signal that drops are allowed.
    event.preventDefault()

    debug('onDragOver', { event })
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragStart(event, change, editor) {
    // Stop propagation so the event isn't visible to parent editors.
    event.stopPropagation()

    isDragging = true

    debug('onDragStart', { event })
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDrop(event, change, editor) {
    // Stop propagation so the event isn't visible to parent editors.
    event.stopPropagation()

    // Nothing happens in read-only mode.
    if (editor.props.readOnly) return true

    // Prevent default so the DOM's state isn't corrupted.
    event.preventDefault()

    debug('onDrop', { event })
  }

  /**
   * On focus.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onFocus(event, change, editor) {
    if (isCopying) return true
    if (editor.props.readOnly) return true

    const el = findDOMNode(editor)

    // COMPAT: If the editor has nested editable elements, the focus can go to
    // those elements. In Firefox, this must be prevented because it results in
    // issues with keyboard navigation. (2017/03/30)
    if (IS_FIREFOX && event.target != el) {
      el.focus()
      return true
    }

    debug('onFocus', { event })
  }

  /**
   * On input.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onInput(event, change, editor) {
    if (isComposing) return true
    if (change.state.isBlurred) return true

    debug('onInput', { event })
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onKeyDown(event, change, editor) {
    if (editor.props.readOnly) return true

    // When composing, these characters commit the composition but also move the
    // selection before we're able to handle it, so prevent their default,
    // selection-moving behavior.
    if (isComposing && HOTKEYS.COMPOSING(event)) {
      event.preventDefault()
      return true
    }

    // Certain hotkeys have native behavior in contenteditable elements which
    // will cause our state to be out of sync, so prevent them.
    if (HOTKEYS.CONTENTEDITABLE(event)) {
      event.preventDefault()
    }

    debug('onKeyDown', { event })
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onPaste(event, change, editor) {
    if (editor.props.readOnly) return true

    // Prevent defaults so the DOM state isn't corrupted.
    event.preventDefault()

    debug('onPaste', { event })
  }

  /**
   * On select.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onSelect(event, change, editor) {
    if (isCopying) return true
    if (isComposing) return true
    if (editor.props.readOnly) return true

    debug('onSelect', { event })
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeInput,
    onBlur,
    onCompositionEnd,
    onCompositionStart,
    onCopy,
    onCut,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
    onFocus,
    onInput,
    onKeyDown,
    onPaste,
    onSelect,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default BeforePlugin
