import Debug from 'debug'
import Hotkeys from 'slate-hotkeys'
import getWindow from 'get-window'
import {
  IS_FIREFOX,
  IS_IE,
  IS_IOS,
  HAS_INPUT_EVENTS_LEVEL_2,
} from 'slate-dev-environment'

import DATA_ATTRS from '../../constants/data-attributes'

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
   */

  const onBeforeInput = (fn, editor) => event => {
    const isSynthetic = !!event.nativeEvent
    if (editor.readOnly) return

    // COMPAT: If the browser supports Input Events Level 2, we will have
    // attached a custom handler for the real `beforeinput` events, instead of
    // allowing React's synthetic polyfill, so we need to ignore synthetics.
    if (isSynthetic && HAS_INPUT_EVENTS_LEVEL_2) return

    debug('onBeforeInput', { event })
    fn(event)
  }

  /**
   * On blur.
   *
   * @param {Event} event
   */

  const onBlur = (fn, editor) => event => {
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
      const el = editor.findDOMNode([])

      // COMPAT: The event should be ignored if the focus is returning to the
      // editor from an embedded editable element (eg. an <input> element inside
      // a void node).
      if (relatedTarget === el) return

      // COMPAT: The event should be ignored if the focus is moving from the
      // editor to inside a void node's spacer element.
      if (relatedTarget.hasAttribute(DATA_ATTRS.SPACER)) return

      // COMPAT: The event should be ignored if the focus is moving to a non-
      // editable section of an element that isn't a void node (eg. a list item
      // of the check list example).
      const node = editor.findNode(relatedTarget)

      if (el.contains(relatedTarget) && node && !editor.isVoid(node)) {
        return
      }
    }

    debug('onBlur', { event })
    fn(event)
  }

  /**
   * On composition end.
   *
   * @param {Event} event
   */

  const onCompositionEnd = (fn, editor) => event => {
    const n = compositionCount

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition is still in affect.
    window.requestAnimationFrame(() => {
      if (compositionCount > n) return
      isComposing = false
    })

    debug('onCompositionEnd', { event })
    fn(event)
  }

  /**
   * On click.
   *
   * @param {Event} event
   */

  const onClick = (fn, editor) => event => {
    debug('onClick', { event })
    fn(event)
  }

  /**
   * On composition start.
   *
   * @param {Event} event
   */

  const onCompositionStart = (fn, editor) => event => {
    isComposing = true
    compositionCount++

    const { value } = editor
    const { selection } = value

    if (!selection.isCollapsed) {
      // https://github.com/ianstormtaylor/slate/issues/1879
      // When composition starts and the current selection is not collapsed, the
      // second composition key-down would drop the text wrapping <spans> which
      // resulted on crash in content.updateSelection after composition ends
      // (because it cannot find <span> nodes in DOM). This is a workaround that
      // erases selection as soon as composition starts and preventing <spans>
      // to be dropped.
      editor.delete()
    }

    debug('onCompositionStart', { event })
    fn(event)
  }

  /**
   * On copy.
   *
   * @param {Event} event
   */

  const onCopy = (fn, editor) => event => {
    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCopy', { event })
    fn(event)
  }

  /**
   * On cut.
   *
   * @param {Event} event
   */

  const onCut = (fn, editor) => event => {
    if (editor.readOnly) return

    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCut', { event })
    fn(event)
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   */

  const onDragEnd = (fn, editor) => event => {
    isDragging = false
    debug('onDragEnd', { event })
    fn(event)
  }

  /**
   * On drag enter.
   *
   * @param {Event} event
   */

  const onDragEnter = (fn, editor) => event => {
    debug('onDragEnter', { event })
    fn(event)
  }

  /**
   * On drag exit.
   *
   * @param {Event} event
   */

  const onDragExit = (fn, editor) => event => {
    debug('onDragExit', { event })
    fn(event)
  }

  /**
   * On drag leave.
   *
   * @param {Event} event
   */

  const onDragLeave = (fn, editor) => event => {
    debug('onDragLeave', { event })
    fn(event)
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   */

  const onDragOver = (fn, editor) => event => {
    // If the target is inside a void node, and only in this case,
    // call `preventDefault` to signal that drops are allowed.
    // When the target is editable, dropping is already allowed by
    // default, and calling `preventDefault` hides the cursor.
    const node = editor.findNode(event.target)

    if (!node || editor.isVoid(node)) {
      event.preventDefault()
    }

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
    fn(event)
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   */

  const onDragStart = (fn, editor) => event => {
    isDragging = true
    debug('onDragStart', { event })
    fn(event)
  }

  /**
   * On drop.
   *
   * @param {Event} event
   */

  const onDrop = (fn, editor) => event => {
    if (editor.readOnly) return

    // Prevent default so the DOM's value isn't corrupted.
    event.preventDefault()

    debug('onDrop', { event })
    fn(event)
  }

  /**
   * On focus.
   *
   * @param {Event} event
   */

  const onFocus = (fn, editor) => event => {
    if (isCopying) return
    if (editor.readOnly) return

    const el = editor.findDOMNode([])

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

    // COMPAT: If the editor has nested editable elements, the focus can go to
    // those elements. In Firefox, this must be prevented because it results in
    // issues with keyboard navigation. (2017/03/30)
    if (IS_FIREFOX && event.target !== el) {
      el.focus()
      return
    }

    debug('onFocus', { event })
    fn(event)
  }

  /**
   * On input.
   *
   * @param {Event} event
   */

  const onInput = (fn, editor) => event => {
    if (isComposing) return
    if (editor.value.selection.isBlurred) return
    debug('onInput', { event })
    fn(event)
  }

  /**
   * On key down.
   *
   * @param {Event} event
   */

  const onKeyDown = (fn, editor) => event => {
    if (editor.readOnly) return

    // When composing, we need to prevent all hotkeys from executing while
    // typing. However, certain characters also move the selection before
    // we're able to handle it, so prevent their default behavior.
    if (isComposing) {
      if (Hotkeys.isCompose(event)) event.preventDefault()
      return
    }

    // Certain hotkeys have native editing behaviors in `contenteditable`
    // elements which will editor the DOM and cause our value to be out of sync,
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
    fn(event)
  }

  /**
   * On key up.
   *
   * @param {Event} event
   */

  const onKeyUp = (fn, editor) => event => {
    debug('onKeyUp', { event })
    fn(event)
  }

  /**
   * On paste.
   *
   * @param {Event} event
   */

  const onPaste = (fn, editor) => event => {
    if (editor.readOnly) return

    // Prevent defaults so the DOM state isn't corrupted.
    event.preventDefault()

    debug('onPaste', { event })
    fn(event)
  }

  /**
   * On select.
   *
   * @param {Event} event
   */

  const onSelect = (fn, editor) => event => {
    if (isCopying) return
    if (isComposing) return

    if (editor.readOnly) return

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

    debug('onSelect', { event })
    fn(event)
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
    onKeyUp,
    onPaste,
    onSelect,
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default BeforePlugin
