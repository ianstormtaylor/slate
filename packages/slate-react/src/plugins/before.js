
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import getWindow from 'get-window'
import keycode from 'keycode'
import logger from 'slate-dev-logger'
import { findDOMNode } from 'react-dom'

import HOTKEYS from '../constants/hotkeys'
import TRANSFER_TYPES from '../constants/transfer-types'
import findRange from '../utils/find-range'
import getTransferData from '../utils/get-transfer-data'
import setTransferData from '../utils/set-transfer-data'
import { IS_FIREFOX, IS_MAC, SUPPORTED_EVENTS } from '../constants/environment'

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
  let isShifting = false
  let isInternalDrag = null

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
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBlur(event, data, change, editor) {
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
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCompositionEnd(event, data, change, editor) {
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
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCompositionStart(event, data, change, editor) {
    isComposing = true
    compositionCount++

    debug('onCompositionStart', { event })
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCopy(event, data, change, editor) {
    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => isCopying = false)

    const { state } = change
    data.type = 'fragment'
    data.fragment = state.fragment

    debug('onCopy', { event })
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCut(event, data, change, editor) {
    if (editor.props.readOnly) return true

    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => isCopying = false)

    const { state } = change
    data.type = 'fragment'
    data.fragment = state.fragment

    debug('onCut', { event })
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragEnd(event, data, change, editor) {
    event.stopPropagation()
    isDragging = false
    isInternalDrag = null

    debug('onDragEnd', { event })
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragOver(event, data, change, editor) {
    if (isDragging) return true
    event.stopPropagation()
    isDragging = true
    isInternalDrag = false

    debug('onDragOver', { event })
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragStart(event, data, change, editor) {
    isDragging = true
    isInternalDrag = true

    const { dataTransfer } = event.nativeEvent
    const d = getTransferData(dataTransfer)
    Object.assign(data, d)

    if (data.type != 'node') {
      const { state } = this.props
      const { fragment } = state
      const encoded = Base64.serializeNode(fragment)
      setTransferData(dataTransfer, TRANSFER_TYPES.FRAGMENT, encoded)
    }

    debug('onDragStart', { event })
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDrop(event, data, change, editor) {
    event.stopPropagation()
    event.preventDefault()

    if (editor.props.readOnly) return

    const { state } = change
    const { nativeEvent } = event
    const { dataTransfer, x, y } = nativeEvent
    const d = getTransferData(dataTransfer)
    Object.assign(data, d)

    // Resolve a range from the caret position where the drop occured.
    const window = getWindow(event.target)
    let range

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      range = window.document.caretRangeFromPoint(x, y)
    } else {
      const position = window.document.caretPositionFromPoint(x, y)
      range = window.document.createRange()
      range.setStart(position.offsetNode, position.offset)
      range.setEnd(position.offsetNode, position.offset)
    }

    // Resolve a Slate range from the DOM range.
    let selection = findRange(range, state)
    if (!selection) return true

    const { document } = state
    const node = document.getNode(selection.anchorKey)
    const parent = document.getParent(node.key)
    const el = findDOMNode(parent)

    // If the drop target is inside a void node, move it into either the next or
    // previous node, depending on which side the `x` and `y` coordinates are
    // closest to.
    if (parent.isVoid) {
      const rect = el.getBoundingClientRect()
      const isPrevious = parent.kind == 'inline'
        ? x - rect.left < rect.left + rect.width - x
        : y - rect.top < rect.top + rect.height - y

      selection = isPrevious
        ? selection.moveToEndOf(document.getPreviousText(node.key))
        : selection.moveToStartOf(document.getNextText(node.key))
    }

    // Add drop-specific information to the data.
    data.target = selection

    // COMPAT: Edge throws "Permission denied" errors when
    // accessing `dropEffect` or `effectAllowed` (2017/7/12)
    try {
      data.effect = dataTransfer.dropEffect
    } catch (err) {
      data.effect = null
    }

    if (d.type == 'fragment' || d.type == 'node') {
      data.isInternal = isInternalDrag
    }

    debug('onDrop', { event })
  }

  /**
   * On focus.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onFocus(event, data, change, editor) {
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
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onInput(event, data, change, editor) {
    if (isComposing) return true
    if (change.state.isBlurred) return true

    debug('onInput', { event })
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onKeyDown(event, data, change, editor) {
    if (editor.props.readOnly) return

    const { key } = event

    // When composing, these characters commit the composition but also move the
    // selection before we're able to handle it, so prevent their default,
    // selection-moving behavior.
    if (
      isComposing &&
      (key == 'ArrowLeft' || key == 'ArrowRight' || key == 'ArrowUp' || key == 'ArrowDown')
    ) {
      event.preventDefault()
      return true
    }

    // Certain hotkeys have native behavior in contenteditable elements which
    // will cause our state to be out of sync, so prevent them.
    if (HOTKEYS.CONTENTEDITABLE(event)) {
      event.preventDefault()
    }

    // Keep track of an `isShifting` flag, because it's often used to trigger
    // "Paste and Match Style" commands, but isn't available on the event in a
    // normal paste event.
    if (key == 'Shift') {
      isShifting = true
    }

    // COMPAT: add the deprecated keyboard event properties.
    addDeprecatedKeyProperties(data, event)

    debug('onKeyDown', { event })
  }

  /**
   * On key up.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onKeyUp(event, data, change, editor) {
    // COMPAT: add the deprecated keyboard event properties.
    addDeprecatedKeyProperties(data, event)

    if (event.key == 'Shift') {
      isShifting = false
    }

    debug('onKeyUp', { event })
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onPaste(event, data, change, editor) {
    if (editor.props.readOnly) return

    event.preventDefault()
    const d = getTransferData(event.clipboardData)
    Object.assign(data, d)

    // COMPAT: Attach the `isShift` flag, so that people can use it to trigger
    // "Paste and Match Style" logic.
    Object.defineProperty(data, 'isShift', {
      enumerable: true,
      get() {
        logger.deprecate('0.28.0', 'The `data.isShift` property of paste events has been deprecated. If you need this functionality, you\'ll need to keep track of that state with `onKeyDown` and `onKeyUp` events instead')
        return isShifting
      }
    })

    debug('onPaste', { event })
  }

  /**
   * On select.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onSelect(event, data, change, editor) {
    if (isCopying) return
    if (isComposing) return
    if (editor.props.readOnly) return

    const window = getWindow(event.target)
    const { state } = change
    const { document, selection } = state
    const native = window.getSelection()

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      data.selection = selection.blur()
    }

    // Otherwise, determine the Slate selection from the native one.
    else {
      let range = findRange(native, state)
      if (!range) return

      const { anchorKey, anchorOffset, focusKey, focusOffset } = range
      const anchorText = document.getNode(anchorKey)
      const focusText = document.getNode(focusKey)
      const anchorInline = document.getClosestInline(anchorKey)
      const focusInline = document.getClosestInline(focusKey)
      const focusBlock = document.getClosestBlock(focusKey)
      const anchorBlock = document.getClosestBlock(anchorKey)

      // COMPAT: If the anchor point is at the start of a non-void, and the
      // focus point is inside a void node with an offset that isn't `0`, set
      // the focus offset to `0`. This is due to void nodes <span>'s being
      // positioned off screen, resulting in the offset always being greater
      // than `0`. Since we can't know what it really should be, and since an
      // offset of `0` is less destructive because it creates a hanging
      // selection, go with `0`. (2017/09/07)
      if (
        anchorBlock &&
        !anchorBlock.isVoid &&
        anchorOffset == 0 &&
        focusBlock &&
        focusBlock.isVoid &&
        focusOffset != 0
      ) {
        range = range.set('focusOffset', 0)
      }

      // COMPAT: If the selection is at the end of a non-void inline node, and
      // there is a node after it, put it in the node after instead. This
      // standardizes the behavior, since it's indistinguishable to the user.
      if (
        anchorInline &&
        !anchorInline.isVoid &&
        anchorOffset == anchorText.text.length
      ) {
        const block = document.getClosestBlock(anchorKey)
        const next = block.getNextText(anchorKey)
        if (next) range = range.moveAnchorTo(next.key, 0)
      }

      if (
        focusInline &&
        !focusInline.isVoid &&
        focusOffset == focusText.text.length
      ) {
        const block = document.getClosestBlock(focusKey)
        const next = block.getNextText(focusKey)
        if (next) range = range.moveFocusTo(next.key, 0)
      }

      range = range.normalize(document)
      data.selection = range
    }

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
 * Add deprecated `data` fields from a key `event`.
 *
 * @param {Object} data
 * @param {Object} event
 */

function addDeprecatedKeyProperties(data, event) {
  const { altKey, ctrlKey, metaKey, shiftKey, which } = event
  const name = keycode(which)

  function define(key, value) {
    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        logger.deprecate('0.28.0', `The \`data.${key}\` property of keyboard events is deprecated, please use the native \`event\` properties instead.`)
        return value
      }
    })
  }

  define('code', which)
  define('key', name)
  define('isAlt', altKey)
  define('isCmd', IS_MAC ? metaKey && !altKey : false)
  define('isCtrl', ctrlKey && !altKey)
  define('isLine', IS_MAC ? metaKey : false)
  define('isMeta', metaKey)
  define('isMod', IS_MAC ? metaKey && !altKey : ctrlKey && !altKey)
  define('isModAlt', IS_MAC ? metaKey && altKey : ctrlKey && altKey)
  define('isShift', shiftKey)
  define('isWord', IS_MAC ? altKey : ctrlKey)
}

/**
 * Export.
 *
 * @type {Object}
 */

export default BeforePlugin
