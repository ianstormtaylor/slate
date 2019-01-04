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

import findNode from '../utils/find-node'
import setSelectionFromDom from '../utils/set-selection-from-dom'
import setTextFromDomNode from '../utils/set-text-from-dom-node'

const ANDROID_API_VERSIONS = [
  [/^9([.]0|)/, 28],
  [/^8[.]1/, 27],
  [/^8([.]0|)/, 26],
  [/^7[.]1/, 25],
  [/^7([.]0|)/, 24],
  [/^6([.]0|)/, 23],
  [/^5[.]1/, 22],
  [/^5([.]0|)/, 21],
  [/^4[.]4/, 20],
]

function getApiVersion() {
  if (!IS_ANDROID) return null
  const { userAgent } = window.navigator
  const matchData = userAgent.match(/Android\s([0-9\.]+)/)
  if (matchData == null) return null
  const versionString = matchData[1]
  for (let tuple of ANDROID_API_VERSIONS) {
    const [regex, version] = tuple
    if (versionString.match(regex)) return version //tags.push(tag)
  }
  return null
}

const API_VERSION = getApiVersion()

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
    debug('onBeforeInput', {
      event,
      status,
      e: pick(event, ['data', 'inputType', 'isComposing']),
    })
    if (status === COMPOSING) return
    next()
  }

  function onCompositionEnd(event, editor, next) {
    debug('onCompositionEnd', { event })
    // fixes a bug in Android API 26 & 27 where a `compositionEnd` is triggered
    // without the corresponding `compositionStart` event when clicking a
    // suggestion.
    //
    // If we don't add this, the `onBeforeInput` is triggered and passes
    // through to the `before` plugin.
    if (API_VERSION === 26 || API_VERSION === 27) {
      status = COMPOSING
    }

    const window = getWindow(event.target)
    const selection = window.getSelection()
    const { anchorNode } = selection
    nodes.add(anchorNode)
    window.requestAnimationFrame(() => {
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
      case 28:
      case 27:
        if (event.key === 'Enter') {
          console.log('pass through')
          next()
        }
        break
      default:
        if (status !== COMPOSING) {
          next()
        }
    }
  }

  function onKeyPress(event, editor, next) {}

  function onSelect(event, editor, next) {
    debug('onSelect', { event, status })
    if (status === COMPOSING) return
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
    onKeyPress,
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
