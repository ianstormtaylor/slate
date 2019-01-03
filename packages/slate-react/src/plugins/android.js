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
import setSelectionFromDom from '../utils/set-selection-from-dom'
import setTextFromDomNode from '../utils/set-text-from-dom-node'

const debug = Debug('slate:android')
debug.reconcile = Debug('slate:reconcile')

// API27
function AndroidPlugin() {
  let isComposing = false
  let nodes = new Set()

  function reconcile(window, editor) {
    debug.reconcile()
    const selection = window.getSelection()
    // const { anchorNode } = selection
    // setTextFromDomNode(window, editor, anchorNode)
    console.log(1)
    nodes.forEach(node => {
      setTextFromDomNode(window, editor, node)
    })
    console.log(2)
    setSelectionFromDom(window, editor, selection)
    nodes.clear()
    console.log(3, editor.value.document.text)
  }

  function onBeforeInput(event, editor, next) {
    debug('onBeforeInput', { event, isComposing })
    if (isComposing) return
    next()
  }

  function onCompositionEnd(event, editor, next) {
    debug('onCompositionEnd', { event })
    // fixes a bug in Android API 27 where a `compositionEnd` is triggered
    // without the corresponding `compositionStart` event when clicking a
    // suggestion.
    // 
    // If we don't add this, the `onBeforeInput` is triggered and passes
    // through to the `before` plugin.
    isComposing = true
    const window = getWindow(event.target)
    const selection = window.getSelection()
    const { anchorNode } = selection
    nodes.add(anchorNode)
    window.requestAnimationFrame(() => {
      isComposing = false
      reconcile(window, editor)
    })
  }

  function onCompositionStart(event, editor, next) {
    debug('onCompositionStart', { event })
    isComposing = true
    nodes.clear()
    next()
  }

  function onCompositionUpdate(event, editor, next) {
    debug('onCompositionUpdate', { event })
    next()
  }

  function onInput(event, editor, next) {
    debug('onInput', { event, isComposing })
    if (isComposing) return
    next()
  }

  function onKeyDown(event, editor, next) {
    debug('onKeyDown', { event, isComposing })
    if (isComposing) return
    next()
  }

  function onSelect(event, editor, next) {
    debug('onSelect', { event, isComposing })
    if (isComposing) return
    next()
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
