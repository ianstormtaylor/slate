import Debug from 'debug'
import getWindow from 'get-window'
import { findDOMNode } from 'react-dom'
import Hotkeys from 'slate-hotkeys'
import {
  IS_FIREFOX,
  IS_IE,
  IS_IOS,
  HAS_INPUT_EVENTS_LEVEL_2,
} from 'slate-dev-environment'

import findNode from '../utils/find-node'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:before')

/**
 * The core before plugin.
 *
 * @return {Object}
 */

function BeforePlugin() {
  let activeElement = null
  let compositionCount = 0
  let isComposing = false
  let isCopying = false
  let isDragging = false

  /**
   * On before input.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onBeforeInput(event, change) {
    const { editor } = change
    const isSynthetic = !!event.nativeEvent
    if (editor.props.readOnly) return true

    // COMPAT: If the browser supports Input Events Level 2, we will have
    // attached a custom handler for the real `beforeinput` events, instead of
    // allowing React's synthetic polyfill, so we need to ignore synthetics.
    if (isSynthetic && HAS_INPUT_EVENTS_LEVEL_2) return true

    debug('onBeforeInput', { event })
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onBlur(event, change) {
    const { editor, value } = change
    if (isCopying) return true
    if (editor.props.readOnly) return true

    const { schema } = editor
    const { relatedTarget, target } = event
    const window = getWindow(target)

    // COMPAT: If the current `activeElement` is still the previous one, this is
    // due to the window being blurred when the tab itself becomes unfocused, so
    // we want to abort early to allow to editor to stay focused when the tab
    // becomes focused again.
    if (activeElement == window.document.activeElement) return true

    // COMPAT: The `relatedTarget` can be null when the new focus target is not
    // a "focusable" element (eg. a `<div>` without `tabindex` set).
    if (relatedTarget) {
      const el = findDOMNode(editor)

      // COMPAT: The event should be ignored if the focus is returning to the
      // editor from an embedded editable element (eg. an <input> element inside
      // a void node).
      if (relatedTarget == el) return true

      // COMPAT: The event should be ignored if the focus is moving from the
      // editor to inside a void node's spacer element.
      if (relatedTarget.hasAttribute('data-slate-spacer')) return true

      // COMPAT: The event should be ignored if the focus is moving to a non-
      // editable section of an element that isn't a void node (eg. a list item
      // of the check list example).
      const node = findNode(relatedTarget, value)
      if (el.contains(relatedTarget) && node && !schema.isVoid(node))
        return true
    }

    debug('onBlur', { event })
  }

  /**
   * On composition end.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onCompositionEnd(event, change) {
    const { editor } = change
    const n = compositionCount

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition is still in affect.
    window.requestAnimationFrame(() => {
      if (compositionCount > n) return
      isComposing = false

      // HACK: we need to re-render the editor here so that it will update its
      // placeholder in case one is currently rendered. This should be handled
      // differently ideally, in a less invasive way?
      // (apply force re-render if isComposing changes)
      if (editor.state.isComposing) {
        editor.setState({ isComposing: false })
      }
    })

    debug('onCompositionEnd', { event })
  }

  /**
   * On composition start.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onCompositionStart(event, change) {
    isComposing = true
    compositionCount++
    const { editor } = change

    // HACK: we need to re-render the editor here so that it will update its
    // placeholder in case one is currently rendered. This should be handled
    // differently ideally, in a less invasive way?
    // (apply force re-render if isComposing changes)
    if (!editor.state.isComposing) {
      editor.setState({ isComposing: true })
    }

    debug('onCompositionStart', { event })
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onCopy(event, change) {
    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCopy', { event })
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onCut(event, change) {
    const { editor } = change
    if (editor.props.readOnly) return true

    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCut', { event })
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onDragEnd(event, change) {
    isDragging = false

    debug('onDragEnd', { event })
  }

  /**
   * On drag enter.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onDragEnter(event, change) {
    debug('onDragEnter', { event })
  }

  /**
   * On drag exit.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onDragExit(event, change) {
    debug('onDragExit', { event })
  }

  /**
   * On drag leave.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onDragLeave(event, change) {
    debug('onDragLeave', { event })
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onDragOver(event, change) {
    // If the target is inside a void node, and only in this case,
    // call `preventDefault` to signal that drops are allowed.
    // When the target is editable, dropping is already allowed by
    // default, and calling `preventDefault` hides the cursor.
    const { editor } = change
    const { schema } = editor
    const node = findNode(event.target, editor.value)
    if (schema.isVoid(node)) event.preventDefault()

    // COMPAT: IE won't call onDrop on contentEditables unless the
    // default dragOver is prevented:
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/913982/
    // (2018/07/11)
    if (IS_IE) event.preventDefault()

    // If a drag is already in progress, don't do this again.
    if (!isDragging) {
      isDragging = true

      // COMPAT: IE will raise an `unspecified error` if dropEffect is
      // set. (2018/07/11)
      if (!IS_IE) {
        event.nativeEvent.dataTransfer.dropEffect = 'move'
      }
    }

    debug('onDragOver', { event })
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onDragStart(event, change) {
    isDragging = true

    debug('onDragStart', { event })
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onDrop(event, change) {
    const { editor } = change
    if (editor.props.readOnly) return true

    // Prevent default so the DOM's value isn't corrupted.
    event.preventDefault()

    debug('onDrop', { event })
  }

  /**
   * On focus.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onFocus(event, change) {
    const { editor } = change
    if (isCopying) return true
    if (editor.props.readOnly) return true

    const el = findDOMNode(editor)

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

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
   */

  function onInput(event, change) {
    if (isComposing) return true
    if (change.value.selection.isBlurred) return true

    debug('onInput', { event })
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onKeyDown(event, change) {
    const { editor } = change
    if (editor.props.readOnly) return true

    // When composing, we need to prevent all hotkeys from executing while
    // typing. However, certain characters also move the selection before
    // we're able to handle it, so prevent their default behavior.
    if (isComposing) {
      if (Hotkeys.isCompose(event)) event.preventDefault()
      return true
    }

    // Certain hotkeys have native editing behaviors in `contenteditable`
    // elements which will change the DOM and cause our value to be out of sync,
    // so they need to always be prevented.
    if (
      !IS_IOS &&
      (Hotkeys.isBold(event) ||
        Hotkeys.isDeleteBackward(event) ||
        Hotkeys.isDeleteForward(event) ||
        Hotkeys.isDeleteLineBackward(event) ||
        Hotkeys.isDeleteLineForward(event) ||
        Hotkeys.isDeleteWordBackward(event) ||
        Hotkeys.isDeleteWordForward(event) ||
        Hotkeys.isItalic(event) ||
        Hotkeys.isRedo(event) ||
        Hotkeys.isSplitBlock(event) ||
        Hotkeys.isTransposeCharacter(event) ||
        Hotkeys.isUndo(event))
    ) {
      event.preventDefault()
    }

    debug('onKeyDown', { event })
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Change} change
   */

  function onPaste(event, change) {
    const { editor } = change
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
   */

  function onSelect(event, change) {
    if (isCopying) return true
    if (isComposing) return true

    const { editor } = change
    if (editor.props.readOnly) return true

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

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
