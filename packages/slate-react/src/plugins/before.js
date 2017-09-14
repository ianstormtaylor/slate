
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import getWindow from 'get-window'
import keycode from 'keycode'
import { Selection } from 'slate'

import TRANSFER_TYPES from '../constants/transfer-types'
import getHtmlFromNativePaste from '../utils/get-html-from-native-paste'
import getPoint from '../utils/get-point'
import getTransferData from '../utils/get-transfer-data'
import setTransferData from '../utils/set-transfer-data'
import { IS_MAC, IS_IE } from '../constants/environment'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:plugins:before')

/**
 * The core "before" plugin, which is designed to execute before any other
 * user-land plugins in the stack.
 *
 * @param {Object} options
 * @return {Object}
 */

function BeforePlugin(options = {}) {
  let composingCount = 0
  let isComposing = false
  let isCopying = false
  let isDragging = false
  let isInternalDrag = null
  let isShifting = false

  /**
   * On before input.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBeforeInput(event, data, change, editor) {
    debug('onBeforeInput', { event, data })

    const { state } = change
    const { selection } = state
    const { anchorKey, anchorOffset, focusKey, focusOffset } = selection

    // Prevent default because input should never be handled by the browser.
    event.preventDefault()

    // COMPAT: In iOS, when using predictive text suggestions, the native
    // selection will be changed to span the existing word, so that the word is
    // replaced. But the `select` fires after the `beforeInput` event, even
    // though the native selection is updated. So we need to manually check if
    // the selection has gotten out of sync, and adjust it if so. (03/18/2017)
    const window = getWindow(event.target)
    const native = window.getSelection()
    const a = getPoint(native.anchorNode, native.anchorOffset, state, editor)
    const f = getPoint(native.focusNode, native.focusOffset, state, editor)
    const hasMismatch = a && f && (
      anchorKey != a.key ||
      anchorOffset != a.offset ||
      focusKey != f.key ||
      focusOffset != f.offset
    )

    // If there is a mismatch, correct it for future plugins.
    if (hasMismatch) {
      change.select({
        anchorKey: a.key,
        anchorOffset: a.offset,
        focusKey: f.key,
        focusOffset: f.offset
      })
    }
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onBlur(event, data, change) {
    debug('onBlur', { event, data })

    // If we're currently copying, the blur is actually from the after plugin's
    // copy logic blurring the editor as it focus the cloned node, so ignore it.
    if (isCopying) {
      return true
    }
  }

  /**
   * On change.
   *
   * @param {Change} change
   * @param {Editor} editor
   */

  function onChange(change, editor) {
    debug('onChange', { change })

    const { state } = change
    const schema = editor.getSchema()
    const prevState = editor.getState()

    // PERF: Skip normalizing if the document hasn't changed, since the core
    // schema only normalizes changes to the document, not selection.
    if (prevState && state.document == prevState.document) return

    // Normalize the state against the user-land schema before any other
    // plugins interact with it.
    change.normalize(schema)
  }

  /**
   * On composition end.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onCompositionEnd(event, data, change) {
    debug('onCompositionEnd', { event, data })

    const count = composingCount

    // After a timeout, unset the composing flag if no new compositions have
    // been started in the meantime.
    setTimeout(() => {
      if (composingCount > count) return
      isComposing = false
    })
  }

  /**
   * On composition start.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onCompositionStart(event, data, change) {
    debug('onCompositionStart', { event, data })

    // Set the is composing state.
    isComposing = true

    // Keep track of how many compositions have started, so that we can know
    // when the composing state ends.
    composingCount++
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onCopy(event, data, change) {
    debug('onCopy', { event, data })
    onCutOrCopy(event, data, change)
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onCut(event, data, change) {
    debug('onCut', { event, data })
    onCutOrCopy(event, data, change)
  }

  /**
   * On cut or copy.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onCutOrCopy(event, data, change) {
    debug('onCutOrCopy', { event, data })

    const window = getWindow(event.target)

    // Set the copying state.
    isCopying = true

    // Unset the copying state after the copy has taken.
    window.requestAnimationFrame(() => {
      isCopying = false
    })

    // Add the current document fragment to the data.
    const { state } = change
    data.type = 'fragment'
    data.fragment = state.fragment
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onDragEnd(event, data, change) {
    debug('onDragEnd', { event, data })

    // Reset the dragging state.
    isDragging = false
    isInternalDrag = null
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onDragOver(event, data, change) {
    debug('onDragOver', { event, data })

    // If the dragging state hasn't already been set, then set it, and that
    // means that this is not an internal drag since it didn't start here.
    if (!isDragging) {
      isDragging = true
      isInternalDrag = false
    }
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onDragStart(event, data, change) {
    debug('onDragStart', { event, data })

    // Set the dragging state.
    isDragging = true
    isInternalDrag = true

    // Add the data from the native event's `dataTransfer` object.
    const { dataTransfer } = event.nativeEvent
    const transfer = getTransferData(dataTransfer)
    Object.keys(transfer).forEach((key) => {
      data[key] = transfer[key]
    })

    // If it's not a node being dragging, then it's a fragment, so set the
    // current fragment as data on the `dataTransfer` object.
    if (!data.type == 'node') {
      const { state } = change
      const encoded = Base64.serializeNode(state.fragment)
      setTransferData(dataTransfer, TRANSFER_TYPES.fragment, encoded)
    }
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onDrop(event, data, change) {
    debug('onDrop', { event, data })

    // Add the native event's drop data to the `data` object.
    const { nativeEvent } = event
    const { dataTransfer, x, y } = nativeEvent
    const transfer = getTransferData(dataTransfer)
    Object.keys(transfer).forEach((key) => {
      data[key] = transfer[key]
    })

    // Resolve the point where the drop occured.
    const window = getWindow(event.target)
    const { state, editor } = this.props
    let range

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      range = window.document.caretRangeFromPoint(x, y)
    } else {
      range = window.document.createRange()
      range.setStart(nativeEvent.rangeParent, nativeEvent.rangeOffset)
    }

    const { startContainer, startOffset } = range
    const point = getPoint(startContainer, startOffset, state, editor)
    if (!point) return

    const target = Selection.create({
      anchorKey: point.key,
      anchorOffset: point.offset,
      focusKey: point.key,
      focusOffset: point.offset,
      isFocused: true,
      isBackward: false,
    })

    // Add drop-specific information to the data.
    data.target = target

    // COMPAT: Edge throws "Permission denied" errors when
    // accessing `dropEffect` or `effectAllowed` (2017/7/12)
    try {
      data.effect = dataTransfer.dropEffect
    } catch (err) {
      data.effect = null
    }

    // Set an `isInternal` flag on the data if the drag is internal, for other
    // plugins to use when making decisions.
    if (data.type == 'fragment' || data.type == 'node') {
      data.isInternal = isInternalDrag
    }
  }

  /**
   * On focus.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onFocus(event, data, change) {
    debug('onFocus', { event, data })

    // If we're currently copying, the focus is actually from the after plugin's
    // copy logic focusing the editor again after the cloned node, so ignore it.
    if (isCopying) {
      return true
    }
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
    debug('onInput', { event, data })

    const { state } = change

    // If we're currently composing, abort.
    if (isComposing) {
      return true
    }

    // Or if the editor isn't focus, abort.
    if (state.isBlurred) {
      return true
    }

    // Get the native selection point.
    const window = getWindow(event.target)
    const native = window.getSelection()
    const { anchorNode, anchorOffset } = native
    const point = getPoint(anchorNode, anchorOffset, state, editor)

    // If we're not able to resolve a native point, abort.
    if (!point) {
      return true
    }

    // Get the range in question.
    const { key, start, end } = point
    const { selection } = state
    const target = selection.moveAnchorTo(key, start).moveFocusTo(key, end)

    // Add the `target` to the `data` for other plugins to use.
    data.target = target
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDown(event, data, change) {
    debug('onKeyDown', { event, data })

    const { altKey, ctrlKey, metaKey, shiftKey, which } = event
    const key = keycode(which)

    // Keep track of an `isShifting` flag, because it's often used to trigger
    // "Paste and Match Style" commands, but isn't available on the event in a
    // normal paste event.
    if (key == 'shift') {
      isShifting = true
    }

    // When composing, these characters commit the composition but also move the
    // selection before we're able to handle it, so prevent their default,
    // selection-moving behavior.
    if (
      (isComposing) &&
      (key == 'left' || key == 'right' || key == 'up' || key == 'down')
    ) {
      event.preventDefault()
      return true
    }

    // Add helpful properties for handling hotkeys to the data object.
    data.code = which
    data.key = key
    data.isAlt = altKey
    data.isCmd = IS_MAC ? metaKey && !altKey : false
    data.isCtrl = ctrlKey && !altKey
    data.isLine = IS_MAC ? metaKey : false
    data.isMeta = metaKey
    data.isMod = IS_MAC ? metaKey && !altKey : ctrlKey && !altKey
    data.isModAlt = IS_MAC ? metaKey && altKey : ctrlKey && altKey
    data.isShift = shiftKey
    data.isWord = IS_MAC ? altKey : ctrlKey

    // These key commands have native behavior in contenteditable elements which
    // will cause our state to be out of sync, so prevent them.
    if (
      (key == 'enter') ||
      (key == 'backspace') ||
      (key == 'delete') ||
      (key == 'b' && data.isMod) ||
      (key == 'i' && data.isMod) ||
      (key == 'y' && data.isMod) ||
      (key == 'z' && data.isMod)
    ) {
      event.preventDefault()
    }
  }

  /**
   * On key up.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyUp(event, data, change) {
    debug('onKeyUp', { event, data })

    const key = keycode(which)

    // If it's the shift key, reset the shift state.
    if (key == 'shift') {
      this.tmp.isShifting = false
    }

    // Add helpful properties for handling hotkeys to the data object.
    const { altKey, ctrlKey, metaKey, shiftKey, which } = event
    data.code = which
    data.key = key
    data.isAlt = altKey
    data.isCmd = IS_MAC ? metaKey && !altKey : false
    data.isCtrl = ctrlKey && !altKey
    data.isLine = IS_MAC ? metaKey : false
    data.isMeta = metaKey
    data.isMod = IS_MAC ? metaKey && !altKey : ctrlKey && !altKey
    data.isModAlt = IS_MAC ? metaKey && altKey : ctrlKey && altKey
    data.isShift = shiftKey
    data.isWord = IS_MAC ? altKey : ctrlKey
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
    debug('onPaste', { event, data })

    // Attach the `isShift` flag, so that people can use it to trigger "Paste
    // and Match Style" logic.
    data.isShift = isShifting

    // Add the data from the native event's `clipboardData` object.
    const transfer = getTransferData(event.clipboardData)
    Object.keys(transfer).forEach((key) => {
      data[key] = transfer[key]
    })

    // COMPAT: In IE 11, only plain text can be retrieved from the event's
    // `clipboardData`. To get HTML, use the browser's native paste action which
    // can only be handled synchronously. (2017/06/23)
    if (IS_IE) {
      // Do not use `event.preventDefault()` as we need the native paste action.
      getHtmlFromNativePaste(event.target, (html) => {
        // If pasted HTML can be retreived, it is added to the `data` object,
        // setting the `type` to `html`.
        const stack = editor.getStack()
        const newData = { ...data, html, type: 'html' }
        const newEvent = event.persist()
        stack.onPaste(newEvent, newData)
      })

      // Return true to prevent the stack from continuing.
      return true
    }

    // Prevent the default paste from occuring.
    event.preventDefault()
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
    debug('onSelect', { event, data })

    // If we're currently copying or composing, ignore it because these result
    // in temporary selection updates.
    if (isCopying || isComposing) {
      return true
    }

    // Try to resolve a new `selection` object for plugins to use...
    const window = getWindow(event.target)
    const native = window.getSelection()
    const { state } = change
    let { document, selection } = state

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      selection = selection.set('isFocused', false)
    }

    // Otherwise, determine the selection from the native one.
    else {
      const { anchorNode, anchorOffset, focusNode, focusOffset } = native
      const anchor = getPoint(anchorNode, anchorOffset, state, editor)
      const focus = getPoint(focusNode, focusOffset, state, editor)

      // If we're not able to resolve the anchor or focus, abort.
      if (!anchor || !focus) {
        return true
      }

      const properties = {
        anchorKey: anchor.key,
        anchorOffset: anchor.offset,
        focusKey: focus.key,
        focusOffset: focus.offset,
        isFocused: true,
        isBackward: null,
      }

      const anchorText = document.getNode(anchor.key)
      const focusText = document.getNode(focus.key)
      const anchorInline = document.getClosestInline(anchor.key)
      const focusInline = document.getClosestInline(focus.key)
      const focusBlock = document.getClosestBlock(focus.key)
      const anchorBlock = document.getClosestBlock(anchor.key)

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
        anchor.offset == 0 &&
        focusBlock &&
        focusBlock.isVoid &&
        focus.offset != 0
      ) {
        properties.focusOffset = 0
      }

      // COMPAT: If the selection is at the end of a non-void inline node, and
      // there is a node after it, put it in the node after instead. This
      // standardizes the behavior, since it's indistinguishable to the user.
      if (
        anchorInline &&
        !anchorInline.isVoid &&
        anchor.offset == anchorText.text.length
      ) {
        const block = document.getClosestBlock(anchor.key)
        const next = block.getNextText(anchor.key)
        if (next) {
          properties.anchorKey = next.key
          properties.anchorOffset = 0
        }
      }

      if (
        focusInline &&
        !focusInline.isVoid &&
        focus.offset == focusText.text.length
      ) {
        const block = document.getClosestBlock(focus.key)
        const next = block.getNextText(focus.key)
        if (next) {
          properties.focusKey = next.key
          properties.focusOffset = 0
        }
      }

      selection = selection
        .merge(properties)
        .normalize(document)
    }

    // Add the `selection` to the `data` object for plugins to use.
    data.selection = selection
  }

  /**
   * Return the core plugin.
   *
   * @type {Object}
   */

  return {
    onBlur,
    onCompositionEnd,
    onCompositionStart,
    onChange,
    onBeforeInput,
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
 * Export.
 *
 * @type {Object}
 */

export default BeforePlugin
