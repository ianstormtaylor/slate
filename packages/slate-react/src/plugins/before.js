import Debug from 'debug'
import Hotkeys from 'slate-hotkeys'
import ReactDOM from 'react-dom'
import getWindow from 'get-window'
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
 * A plugin that adds the "before" browser-specific logic to the editor.
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
   * @param {Function} next
   */

  function onBeforeInput(event, change, next) {
    const { editor } = change
    const isSynthetic = !!event.nativeEvent
    if (editor.readOnly) return

    // COMPAT: If the browser supports Input Events Level 2, we will have
    // attached a custom handler for the real `beforeinput` events, instead of
    // allowing React's synthetic polyfill, so we need to ignore synthetics.
    if (isSynthetic && HAS_INPUT_EVENTS_LEVEL_2) return

    debug('onBeforeInput', { event })
    next()
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onBlur(event, change, next) {
    const { editor } = change
    if (isCopying) return
    if (editor.readOnly) return

    const { relatedTarget, target } = event
    const window = getWindow(target)

    // COMPAT: If the current `activeElement` is still the previous one, this is
    // due to the window being blurred when the tab itself becomes unfocused, so
    // we want to abort early to allow to editor to stay focused when the tab
    // becomes focused again.
    if (activeElement === window.document.activeElement) return

    // COMPAT: The `relatedTarget` can be null when the new focus target is not
    // a "focusable" element (eg. a `<div>` without `tabindex` set).
    if (relatedTarget) {
      const el = ReactDOM.findDOMNode(editor)

      // COMPAT: The event should be ignored if the focus is returning to the
      // editor from an embedded editable element (eg. an <input> element inside
      // a void node).
      if (relatedTarget === el) return

      // COMPAT: The event should be ignored if the focus is moving from the
      // editor to inside a void node's spacer element.
      if (relatedTarget.hasAttribute('data-slate-spacer')) return

      // COMPAT: The event should be ignored if the focus is moving to a non-
      // editable section of an element that isn't a void node (eg. a list item
      // of the check list example).
      const node = findNode(relatedTarget, editor)
      if (el.contains(relatedTarget) && node && !change.isVoid(node)) return
    }

    debug('onBlur', { event })
    next()
  }

  /**
   * On composition end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onCompositionEnd(event, change, next) {
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
    next()
  }

  /**
   * On click.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onClick(event, change, next) {
    debug('onClick', { event })
    next()
  }

  /**
   * On composition start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onCompositionStart(event, change, next) {
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
    next()
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onCopy(event, change, next) {
    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCopy', { event })
    next()
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onCut(event, change, next) {
    const { editor } = change
    if (editor.readOnly) return

    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCut', { event })
    next()
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragEnd(event, change, next) {
    isDragging = false
    debug('onDragEnd', { event })
    next()
  }

  /**
   * On drag enter.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragEnter(event, change, next) {
    debug('onDragEnter', { event })
    next()
  }

  /**
   * On drag exit.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragExit(event, change, next) {
    debug('onDragExit', { event })
    next()
  }

  /**
   * On drag leave.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragLeave(event, change, next) {
    debug('onDragLeave', { event })
    next()
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragOver(event, change, next) {
    // If the target is inside a void node, and only in this case,
    // call `preventDefault` to signal that drops are allowed.
    // When the target is editable, dropping is already allowed by
    // default, and calling `preventDefault` hides the cursor.
    const { editor } = change
    const node = findNode(event.target, editor)
    if (change.isVoid(node)) event.preventDefault()

    // COMPAT: IE won't call onDrop on contentEditables unless the
    // default dragOver is prevented:
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/913982/
    // (2018/07/11)
    if (IS_IE) {
      event.preventDefault()
    }

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
    next()
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragStart(event, change, next) {
    isDragging = true
    debug('onDragStart', { event })
    next()
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDrop(event, change, next) {
    const { editor } = change
    if (editor.readOnly) return

    // Prevent default so the DOM's value isn't corrupted.
    event.preventDefault()

    debug('onDrop', { event })
    next()
  }

  /**
   * On focus.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onFocus(event, change, next) {
    const { editor } = change
    if (isCopying) return
    if (editor.readOnly) return

    const el = ReactDOM.findDOMNode(editor)

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

    // COMPAT: If the editor has nested editable elements, the focus can go to
    // those elements. In Firefox, this must be prevented because it results in
    // issues with keyboard navigation. (2017/03/30)
    if (IS_FIREFOX && event.target != el) {
      el.focus()
      return
    }

    debug('onFocus', { event })
    next()
  }

  /**
   * On input.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onInput(event, change, next) {
    if (isComposing) return
    if (change.value.selection.isBlurred) return
    debug('onInput', { event })
    next()
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onKeyDown(event, change, next) {
    const { editor } = change
    if (editor.readOnly) return

    // When composing, we need to prevent all hotkeys from executing while
    // typing. However, certain characters also move the selection before
    // we're able to handle it, so prevent their default behavior.
    if (isComposing) {
      if (Hotkeys.isCompose(event)) event.preventDefault()
      return
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
    next()
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onPaste(event, change, next) {
    const { editor } = change
    if (editor.readOnly) return

    // Prevent defaults so the DOM state isn't corrupted.
    event.preventDefault()

    debug('onPaste', { event })
    next()
  }

  /**
   * On select.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onSelect(event, change, next) {
    if (isCopying) return
    if (isComposing) return

    const { editor } = change
    if (editor.readOnly) return

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

    debug('onSelect', { event })
    next()
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeInput,
    onBlur,
    onClick,
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
