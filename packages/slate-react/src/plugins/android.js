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
import isInputDataLastChar from '../utils/is-input-data-last-char'
import ElementSnapshot from '../utils/element-snapshot'
import SlateSnapshot from '../utils/slate-snapshot'
import Executor from '../utils/executor'

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
  let compositionEndSnapshot = null

  let reconciler = null

  // Keey a snapshot after a `keydown` event in API 26/27.
  // If an `input` gets called with `inputType` of `deleteContentBackward`
  // immediately after then we need to undo the delete to keep React in sync
  // with the DOM.
  let keyDownSnapshot = null

  let deleter = null

  // Because Slate implements its own event handler for `beforeInput` in
  // addition to React's version, we actually get two. If we cancel the
  // first native version, the React one will still fire. We set this to
  // `true` if we don't want that to happen. Remember that when we prevent it,
  // we need to tell React to `preventDefault` so the event doesn't continue
  // through React's event system.
  let preventNextBeforeInput = false

  // Canceling beforeInput in API 28 doesn't seem to stop the event from
  // happening. We set this to true to prevent the input that follows.
  let preventNextInput = false

  // When a composition ends, in some API versions we may want to know what
  // to do next and that can depend on what combination of events happens
  // after. For example in API 26/27, if we get a `beforeInput` that tells
  // us that the input was a `.`, then we want the reconcile to happen even
  // if there are `onInput:delete` events that follow. In this case, we would
  // set `compositionEndAction` to `period`. During the `onInput` we would
  // check if the `compositionEndAction` says `period` and if so we would
  // not start the `delete` action.
  let compositionEndAction = null

  function reconcile(window, editor, { from }) {
    debug.reconcile({ from })
    const domSelection = window.getSelection()
    nodes.forEach(node => {
      setTextFromDomNode(window, editor, node)
    })
    const sel = getSelectionFromDom(window, editor, domSelection)
    console.log({ sel: sel ? sel.toJSON() : null })
    setSelectionFromDom(window, editor, domSelection)
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
    const window = getWindow(event.target)
    if (preventNextBeforeInput) {
      event.preventDefault()
      preventNextBeforeInput = false
      return
    }
    switch (API_VERSION) {
      case 25:
        // prevent onBeforeInput to allow selecting an alternate suggest to
        // work.
        break
      case 26:
      case 27:
        if (deleter) {
          deleter.cancel()
          reconciler.resume()
        }
        // This analyses Android's native `beforeInput` which Slate adds
        // on in the `Content` component. It only fires if the cursor is at
        // the end of a block. Otherwise, the code below checks.
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
          if (isInputDataLastChar(event.data, ['.'])) {
            debug('onBeforeInput:period')
            reconciler.cancel()
            compositionEndAction = 'period'
            return
          }
          // This looks at the beforeInput event's data property and sees if it
          // ends in a linefeed which is character code 10. This appears to be
          // the only way to detect that enter has been pressed except at end
          // of line where it doesn't work.
          const isEnter = isInputDataEnter(event.data)
          if (isEnter) {
            reconciler && reconciler.cancel()
            window.requestAnimationFrame(() => {
              debug('onBeforeInput:enter:react', {})
              compositionEndSnapshot.apply()
              editor.splitBlock()
            })
          }
        }
        break
      case 28:
        // If a `beforeInput` event fires after an `input:deleteContentBackward`
        // event, it appears to be a good indicator that it is some sort of
        // special combined Android event. If this is the case, then we don't
        // want to have a deletion to happen, we just want to wait until Android
        // has done its thing and then at the end we just want to reconcile.
        if (deleter) {
          deleter.cancel()
          reconciler.resume()
        }
        break
      default:
        if (status !== COMPOSING) next()
    }
  }

  function onCompositionEnd(event, editor, next) {
    debug('onCompositionEnd', { event })
    const window = getWindow(event.target)
    const domSelection = window.getSelection()
    const { anchorNode } = domSelection
    switch (API_VERSION) {
      case 26:
      case 27:
        compositionEndSnapshot = new SlateSnapshot(window, editor)
        // fixes a bug in Android API 26 & 27 where a `compositionEnd` is triggered
        // without the corresponding `compositionStart` event when clicking a
        // suggestion.
        //
        // If we don't add this, the `onBeforeInput` is triggered and passes
        // through to the `before` plugin.
        status = COMPOSING
        break
    }

    compositionEndAction = 'reconcile'
    nodes.add(anchorNode)
    reconciler = new Executor(window, () => {
      status = NONE
      reconcile(window, editor, { from: 'onCompositionEnd:reconciler' })
      compositionEndAction = null
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
      e: pick(event, ['data', 'nativeEvent', 'inputType', 'isComposing']),
    })
    switch (API_VERSION) {
      case 24:
      case 25:
        break
      case 26:
      case 27:
      case 28:
        const { nativeEvent } = event
        if (API_VERSION === 28) {
          // NOTE API 27:
          // It is confirmed that this bug does not present itself on API27.
          // A space fires a `compositionEnd` (as well as other events including
          // an input that is a delete) so the reconciliation happens.
          //
          // NOTE API 28:
          // When a user hits space and then backspace in `middle` we end up
          // with `midle`.
          //
          // This is because when the user hits space, the composition is not
          // ended because `compositionEnd` is not called yet. When backspace is
          // hit, the `compositionEnd` is called. We need to revert the DOM but
          // the reconciler has not had a chance to run from the
          // `compositionEnd` because it is set to run on the next
          // `requestAnimationFrame`. When the backspace is carried out on the
          // Slate Value, Slate doesn't know about the space yet so the
          // backspace is carried out without the space cuasing us to lose a
          // character.
          //
          // This fix forces Android to reconcile immediately after hitting
          // the space.
          if (
            nativeEvent.inputType === 'insertText' &&
            nativeEvent.data === ' '
          ) {
            reconciler && reconciler.cancel()
            deleter && deleter.cancel()
            reconcile(window, editor, { from: 'onInput:space' })
            return
          }
        }
        if (API_VERSION === 26 || API_VERSION === 27) {
          if (compositionEndAction === 'period') {
            debug('onInput:period:abort')
            // This means that there was a `beforeInput` that indicated the
            // period was pressed. When a period is pressed, you get a bunch
            // of delete actions mixed in. We want to ignore those. At this
            // point, we add the current node to the list of things we need to
            // resolve at the next compositionEnd. We know that a new
            // composition will start right after this event so it is safe to
            // do this.
            const { anchorNode } = window.getSelection()
            nodes.add(anchorNode)
            return
          }
        }
        if (nativeEvent.inputType === 'deleteContentBackward') {
          debug('onInput:delete', { keyDownSnapshot })
          const window = getWindow(event.target)
          reconciler && reconciler.cancel()
          deleter && deleter.cancel()
          deleter = new Executor(
            window,
            () => {
              debug('onInput:delete:callback', { keyDownSnapshot })
              keyDownSnapshot.apply(editor)
              editor.deleteBackward()
              deleter = null
            },
            {
              onCancel() {
                deleter = null
              },
            }
          )
          return
        }
        if (status === COMPOSING) {
          const { anchorNode } = window.getSelection()
          nodes.add(anchorNode)
          return
        }
        // Some keys like '.' are input without compositions. This happens
        // in API28. It might be happening in API 27 as well. Check by typing
        // `It me. No.` On a blank line.
        if (API_VERSION === 28) {
          next()
        }
        break
      default:
        if (status === COMPOSING) return
        next()
    }
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
        'nativeEvent',
        'which',
      ]),
    })
    const window = getWindow(event.target)
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
        if (event.key === 'Enter') {
          debug('onKeyDown:enter', {})
          if (deleter) {
            // If a `deleter` exists which means there was an onInput with
            // `deleteContentBackwards` that hasn't fired yet, then we know
            // this is one of the cases where we have to revert to before
            // the split.
            deleter.cancel()
            event.preventDefault()
            window.requestAnimationFrame(() => {
              debug('onKeyDown:enter:callback')
              compositionEndSnapshot.apply(editor)
              editor.splitBlock()
            })
          } else {
            event.preventDefault()
            // If there is no deleter, all we have to do is prevent the
            // action before applying or splitBlock. In this scenario, we
            // have to grab the selection from the DOM.
            const domSelection = window.getSelection()
            const selection = getSelectionFromDom(window, editor, domSelection)
            editor.moveTo(selection.anchor.key, selection.anchor.offset)
            editor.splitBlock()
          }
          return
        }

        // We need to take a snapshot of the current selection and the
        // element before when the user hits the backspace key. This is because
        // we only know if the user hit backspace if the `onInput` event that
        // follows has an `inputType` of `deleteContentBackward`. At that time
        // it's too late to stop the event.
        keyDownSnapshot = new SlateSnapshot(window, editor, {
          before: true,
        })

        // If we let 'Enter' through it breaks handling of hitting
        // enter at the beginning of a word so we need to stop it.
        break
      case 28:
        {
          if (event.key === 'Enter') {
            debug('onKeyDown:enter')
            const domSelection = window.getSelection()
            setSelectionFromDom(window, editor, domSelection)
            next()
            return
          }
          // We need to take a snapshot of the current selection and the
          // element before when the user hits the backspace key. This is because
          // we only know if the user hit backspace if the `onInput` event that
          // follows has an `inputType` of `deleteContentBackward`. At that time
          // it's too late to stop the event.
          debug('onKeyDown:snapshot')
          keyDownSnapshot = new SlateSnapshot(window, editor, {
            before: true,
          })
        }
        // If we let 'Enter' through it breaks handling of hitting
        // enter at the beginning of a word so we need to stop it.
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
      // We don't want to have the selection move around in an onSelect because
      // it happens after we press `enter` in the same transaction. This
      // causes the cursor position to not be properly placed.
      case 26:
      case 27:
        break
      default:
        console.log({ status })
        if (status !== COMPOSING) next()
    }
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeInput,
    onCompositionEnd,
    onCompositionStart,
    onCompositionUpdate,
    onInput,
    onKeyDown,
    onSelect,
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default AndroidPlugin
