import Debug from 'debug'
import Hotkeys from 'slate-hotkeys'
import ReactDOM from 'react-dom'
import getWindow from 'get-window'
import pick from 'lodash/pick'
import {
  IS_FIREFOX,
  IS_IE,
  IS_IOS,
  IS_ANDROID,
  HAS_INPUT_EVENTS_LEVEL_2,
} from 'slate-dev-environment'

import API_VERSION from '../utils/android-api-version'
import findNode from '../utils/find-node'
import closest from '../utils/closest'
import getSelectionFromDom from '../utils/get-selection-from-dom'
import setSelectionFromDom from '../utils/set-selection-from-dom'
import setTextFromDomNode from '../utils/set-text-from-dom-node'
import isInputDataEnter from '../utils/is-input-data-enter'
import ElementSnapshot from '../utils/element-snapshot'

const debug = Debug('slate:android')
debug.reconcile = Debug('slate:reconcile')

debug('API_VERSION', { API_VERSION })

const NONE = 0
const COMPOSING = 1
const WAITING = 2

// API27
function AndroidPlugin() {
  // composition status can be NONE, COMPOSING or WAITING
  let status = NONE

  let nodes = new Set()

  // Keep a snapshot after a composition end for API 26/27.
  // If a `beforeInput` gets called with data that ends in an ENTER then we
  // need to use this snapshot to revert the DOM so that React doesn't get
  // out of sync with the DOM.
  // We also need to cancel the `reconcile` operation as it interferes in
  // certain scenarios like hitting 'enter' at the end of a word.
  let beforeSplitSnapshot = null
  let beforeSplitSelection = null
  let beforeSplitReconcileId = null

  // Because Slate implements its own event handler for `beforeInput` in
  // addition to React's version, we actually get two. If we cancel the
  // first native version, the React one will still fire. We set this to
  // `true` if we don't want that to happen. Remember that when we prevent it,
  // we need to tell React to `preventDefault` so the event doesn't continue
  // through React's event system.
  let preventNextBeforeInput = false

  function reconcile(window, editor) {
    debug.reconcile()
    const selection = window.getSelection()
    nodes.forEach(node => {
      setTextFromDomNode(window, editor, node)
    })
    setSelectionFromDom(window, editor, selection)
    nodes.clear()
  }

  function onBeforeInput(event, editor, next) {
    const isNative = !event.nativeEvent
    debug('onBeforeInput', {
      isNative,
      event,
      status,
      e: pick(event, ['data', 'inputType', 'isComposing', 'nativeEvent']),
    })
    switch (API_VERSION) {
      case 25:
        // prevent onBeforeInput to allow selecting an alternate suggest to
        // work.
        break
      case 26:
      case 27:
        if (preventNextBeforeInput) {
          event.preventDefault()
          preventNextBeforeInput = false
          return
        }
        // This analyses Android's native `beforeInput` which Slate adds
        // on in the `Content` component. It only fires if the cursor is at
        // the end of a block. Otherwise, the code above detects the `enter.
        //
        if (isNative) {
          if (
            event.inputType === 'insertParagraph' ||
            event.inputType === 'insertLineBreak'
          ) {
            debug('onBeforeInput:enter:native', {})
            const domSelection = window.getSelection()
            const selection = getSelectionFromDom(window, editor, domSelection)
            preventNextBeforeInput = true
            event.preventDefault()
            editor.moveTo(selection.anchor.key, selection.anchor.offset)
            editor.splitBlock()
          }
        } else {
          // This looks at the beforeInput event's data property and sees if it
          // ends in an 'enter' which is character code 10. This appears to be
          // the only way to detect that enter has been pressed except at end
          // of line where it doesn't work.
          const isEnter = isInputDataEnter(event.data)
          if (isEnter) {
            const window = getWindow(event.target)
            window.cancelAnimationFrame(beforeSplitReconcileId)
            window.requestAnimationFrame(() => {
              debug('onBeforeInput:enter:react', {})
              beforeSplitSnapshot.apply()
              const selection = beforeSplitSelection
              editor.moveTo(selection.anchor.key, selection.anchor.offset)
              editor.splitBlock()
            })
          }
        }
        break
      default:
        if (status !== COMPOSING) next()
    }
  }

  function onCompositionEnd(event, editor, next) {
    debug('onCompositionEnd', { event })
    const window = getWindow(event.target)
    const selection = window.getSelection()
    const { anchorNode } = selection
    if (API_VERSION === 26 || API_VERSION === 27) {
      const subrootEl = closest(anchorNode, '[data-slate-editor] > *')
      beforeSplitSelection = getSelectionFromDom(window, editor, selection)
      beforeSplitSnapshot = new ElementSnapshot(subrootEl)
      // fixes a bug in Android API 26 & 27 where a `compositionEnd` is triggered
      // without the corresponding `compositionStart` event when clicking a
      // suggestion.
      //
      // If we don't add this, the `onBeforeInput` is triggered and passes
      // through to the `before` plugin.
      status = COMPOSING
    }

    nodes.add(anchorNode)
    beforeSplitReconcileId = window.requestAnimationFrame(() => {
      status = NONE
      reconcile(window, editor)
    })
  }

  function onCompositionStart(event, editor, next) {
    debug('onCompositionStart', { event })
    status = COMPOSING
    nodes.clear()
    // next()
  }

  function onCompositionUpdate(event, editor, next) {
    debug('onCompositionUpdate', { event })
    // next()
  }

  function onInput(event, editor, next) {
    debug('onInput', {
      event,
      status,
      e: pick(event, ['data', 'inputType', 'isComposing']),
    })
    if (status === COMPOSING) return
    next()
  }

  function onKeyDown(event, editor, next) {
    debug('onKeyDown', {
      event,
      status,
      e: pick(event, [
        'char',
        'charCode',
        'code',
        'key',
        'keyCode',
        'keyIdentifier',
        'keyLocation',
        'location',
        'which',
      ]),
    })
    switch (API_VERSION) {
      // 1. We want to allow enter keydown to allows go through
      // 2. We want to deny keydown, I think, when it fires before the composition
      //    or something. Need to remember what it was.

      case 25:
        // in API25 prevent other keys to fix clicking a word and then
        // selecting an alternate suggestion.
        //
        // NOTE:
        // The `setSelectionFromDom` is to allow hitting `Enter` to work
        // because the selection needs to be in the right place; however,
        // for now we've removed the cancelling of `onSelect` and everything
        // appears to be working. Not sure why we removed `onSelect` though
        // in API25.
        if (event.key === 'Enter') {
          // const window = getWindow(event.target)
          // const selection = window.getSelection()
          // setSelectionFromDom(window, editor, selection)
          next()
        }
        break
      case 26:
      case 27:
        // If we let 'Enter' through it breaks handling of hitting
        // enter at the beginning of a word.
        break
      case 28:
        // API 28 handles the 'Enter' key properly so we can let that through.
        if (event.key === 'Enter') {
          next()
        }
        break
      default:
        if (status !== COMPOSING) {
          next()
        }
    }
  }

  function onSelect(event, editor, next) {
    debug('onSelect', { event, status })
    switch (API_VERSION) {
      // NOTE:
      // Not sure why we had this exception to not handle `onSelect` before.
      // If we add this code back in, make sure to re-enable the `onKeyDown`
      // special case.

      // case 25:
      //   break

      // We don't want to have the selection move around in an onSelect because
      // it happens after we press `enter` in the same transaction. This
      // causes the cursor position to not be properly placed.
      case 26:
      case 27:
        // const window = getWindow(event.target)
        // const selection = window.getSelection()
        // beforeSplitSelection = getSelectionFromDom(window, editor, selection)
        // console.log('onSelect', beforeSplitSelection.toJSON())
        break
      default:
        if (status !== COMPOSING) next()
    }
    // if (status === COMPOSING) return
    // next()
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeInput,
    // onBlur,
    // onClick,
    onCompositionEnd,
    onCompositionStart,
    onCompositionUpdate,
    // onCopy,
    // onCut,
    // onDragEnd,
    // onDragEnter,
    // onDragExit,
    // onDragLeave,
    // onDragOver,
    // onDragStart,
    // onDrop,
    // onFocus,
    onInput,
    onKeyDown,
    // onPaste,
    onSelect,
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default AndroidPlugin
