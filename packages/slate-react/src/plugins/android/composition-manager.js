import Debug from 'debug'
import getWindow from 'get-window'
import ReactDOM from 'react-dom'
import diffText from './diff-text'

/**
 * @type {Debug}
 */

const debug = Debug('slate:composition-manager')

/**
 * Unicode String for a ZERO_WIDTH_SPACE
 *
 * @type {String}
 */

const ZERO_WIDTH_SPACE = String.fromCharCode(65279)

/**
 * https://github.com/facebook/draft-js/commit/cda13cb8ff9c896cdb9ff832d1edeaa470d3b871
 */

const flushControlled = ReactDOM.unstable_flushControlled

function renderSync(editor, fn) {
  flushControlled(() => {
    fn()
    editor.controller.flush()
  })
}

/**
 * Takes text from a dom node and an offset within that text and returns an
 * object with fixed text and fixed offset which removes zero width spaces
 * and adjusts the offset.
 *
 * Optionally, if an `isLastNode` argument is passed in, it will also remove
 * a trailing newline.
 *
 * @param {String} text
 * @param {Number} offset
 * @param {Boolean} isLastNode
 */

function fixTextAndOffset(prevText, prevOffset = 0, isLastNode = false) {
  let nextOffset = prevOffset
  let nextText = prevText
  let index = 0

  while (index !== -1) {
    index = nextText.indexOf(ZERO_WIDTH_SPACE, index)
    if (index === -1) break
    if (nextOffset > index) nextOffset--
    nextText = `${nextText.slice(0, index)}${nextText.slice(index + 1)}`
  }

  // remove the last newline if we are in the last node of a block
  const lastChar = nextText.charAt(nextText.length - 1)

  if (isLastNode && lastChar === '\n') {
    nextText = nextText.slice(0, -1)
  }

  const maxOffset = nextText.length

  if (nextOffset > maxOffset) nextOffset = maxOffset
  return { text: nextText, offset: nextOffset }
}

/**
 * Based loosely on:
 *
 * https://github.com/facebook/draft-js/blob/master/src/component/handlers/composition/DOMObserver.js
 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/domobserver.js
 *
 * But is an analysis mainly for `backspace` and `enter` as we handle
 * compositions as a single operation.
 *
 * @param {} element
 */

function CompositionManager(editor) {
  /**
   * A MutationObserver that flushes to the method `flush`
   *
   * @type {MutationObserver}
   */

  const observer = new window.MutationObserver(flush)

  let win = null

  /**
   * Object that keeps track of the most recent state
   *
   * @type {Range}
   */

  const last = {
    rootEl: null, // root element that MutationObserver is attached to
    diff: null, // last text node diff between Slate and DOM
    range: null, // last range selected
    domNode: null, // last DOM node the cursor was in
  }

  /**
   * Connect the MutationObserver to a specific editor root element
   */

  function connect() {
    debug('connect', { rootEl })

    const rootEl = editor.findDOMNode([])

    if (last.rootEl === rootEl) return

    debug('connect:run')

    win = getWindow(rootEl)

    observer.observe(rootEl, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true,
    })
  }

  function disconnect() {
    debug('disconnect')
    observer.disconnect()
    last.rootEl = null
  }

  function clearDiff() {
    debug('clearDIff')
    last.diff = null
  }

  /**
   * Clear the `last` properties related to an action only
   */

  function clearAction() {
    debug('clearAction')
    last.diff = null
    last.domNode = null
  }

  /**
   * Apply the last `diff`
   *
   * We don't want to apply the `diff` at the time it is created because we
   * may be in a composition. There are a few things that trigger the applying
   * of the saved diff. Sometimeson its own and sometimes immediately before
   * doing something else with the Editor.
   *
   * - `onCompositionEnd` event
   * - `onSelect` event only when the user has moved into a different node
   * - The user hits `enter`
   * - The user hits `backspace` and removes an inline node
   * - The user hits `backspace` and merges two blocks
   */

  function applyDiff() {
    debug('applyDiff')
    const { diff } = last
    if (diff == null) return
    debug('applyDiff:run')
    const { document } = editor.value

    let entire = editor.value.selection
      .moveAnchorTo(diff.path, diff.start)
      .moveFocusTo(diff.path, diff.end)

    entire = document.resolveRange(entire)

    editor.insertTextAtRange(entire, diff.insertText)
  }

  /**
   * Handle `enter` that splits block
   */

  function splitBlock() {
    debug('splitBlock')

    renderSync(editor, () => {
      applyDiff()

      if (last.range) {
        editor.select(last.range)
      } else {
        debug('splitBlock:NO-SELECTION')
      }

      editor
        .splitBlock()
        .focus()
        .restoreDOM()

      clearAction()
    })
  }

  /**
   * Handle `backspace` that merges blocks
   */

  function mergeBlock() {
    debug('mergeBlock')

    /**
     * The delay is required because hitting `enter`, `enter` then `backspace`
     * in a word results in the cursor being one position to the right in
     * Android 9.
     *
     * Slate sets the position to `0` and we even check it immediately after
     * setting it and it is correct, but somewhere Android moves it to the right.
     *
     * This happens only when using the virtual keyboard. Hitting enter on a
     * hardware keyboard does not trigger this bug.
     *
     * The call to `focus` is required because when we switch examples then
     * merge a block, we lose focus in Android 9 (possibly others).
     */

    win.requestAnimationFrame(() => {
      renderSync(editor, () => {
        applyDiff()

        editor
          .select(last.range)
          .deleteBackward()
          .focus()
          .restoreDOM()

        clearAction()
      })
    })
  }

  /**
   * The requestId used to the save selection
   *
   * @type {Any}
   */

  let onSelectTimeoutId = null

  let bufferedMutations = []
  let startActionFrameId = null
  let isFlushing = false

  /**
   * Mark the beginning of an action. The action happens when the
   * `requestAnimationFrame` expires.
   *
   * If `startAction` is called again, it pushes the `action` to a new
   * `requestAnimationFrame` and cancels the old one.
   */

  function startAction() {
    if (onSelectTimeoutId) {
      window.cancelAnimationFrame(onSelectTimeoutId)
      onSelectTimeoutId = null
    }

    isFlushing = true

    if (startActionFrameId) window.cancelAnimationFrame(startActionFrameId)

    startActionFrameId = window.requestAnimationFrame(() => {
      if (bufferedMutations.length > 0) {
        flushAction(bufferedMutations)
      }

      startActionFrameId = null
      bufferedMutations = []
      isFlushing = false
    })
  }

  /**
   * Handle MutationObserver flush
   *
   * @param {MutationList} mutations
   */

  function flush(mutations) {
    debug('flush')
    bufferedMutations.push(...mutations)
    startAction()
  }

  /**
   * Handle a `requestAnimationFrame` long batch of mutations.
   *
   * @param {Array} mutations
   */

  function flushAction(mutations) {
    debug('flushAction', mutations.length, mutations)

    // If there is an expanded collection, delete it
    if (last.range && !last.range.isCollapsed) {
      renderSync(editor, () => {
        editor
          .select(last.range)
          .deleteBackward()
          .focus()
          .restoreDOM()
      })
      return
    }

    if (mutations.length > 1) {
      // check if one of the mutations matches the signature of an `enter`
      // which we use to signify a `splitBlock`
      const splitBlockMutation = mutations.find(m => {
        if (m.type !== 'childList') return false
        if (m.addedNodes.length === 0) return false
        const addedNode = m.addedNodes[0]

        // If a text node is created anywhere with a newline in it, it's an
        // enter
        if (
          addedNode.nodeType === window.Node.TEXT_NODE &&
          addedNode.textContent === '\n'
        )
          return true

        // If an element is created with a key that matches a block in our
        // document, that means the mutation is splitting an existing block
        // by creating a new element with the same key.
        if (addedNode.nodeType !== window.Node.ELEMENT_NODE) return false
        const dataset = addedNode.dataset
        const key = dataset.key
        if (key == null) return false
        const block = editor.value.document.getClosestBlock(key)
        return !!block
      })

      if (splitBlockMutation) {
        splitBlock()
        return
      }
    }

    // If we haven't matched a more specific mutation already, these general
    // mutation catchers will try and determine what the user was trying to
    // do.

    const firstMutation = mutations[0]

    if (firstMutation.type === 'characterData') {
      resolveDOMNode(firstMutation.target.parentNode)
    } else if (firstMutation.type === 'childList') {
      if (firstMutation.removedNodes.length > 0) {
        if (mutations.length === 1) {
          removeNode(firstMutation.removedNodes[0])
        } else {
          mergeBlock()
        }
      } else if (firstMutation.addedNodes.length > 0) {
        splitBlock()
      }
    }
  }

  /**
   * Takes a DOM Node and resolves it against Slate's Document.
   *
   * Saves the changes to `last.diff` which can be applied later using
   * `applyDiff()`
   *
   * @param {DOMNode} domNode
   */

  function resolveDOMNode(domNode) {
    debug('resolveDOMNode')

    const { value } = editor
    const { document } = value

    const dataElement = domNode.closest(`[data-key]`)
    const key = dataElement.dataset.key
    const path = document.getPath(key)
    const block = document.getClosestBlock(key)
    const node = document.getDescendant(key)
    const prevText = node.text

    // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    const isLastNode = block.nodes.last() === node

    const fix = fixTextAndOffset(domNode.textContent, 0, isLastNode)

    const nextText = fix.text

    // If the text is no different, there is no diff.
    if (nextText === prevText) {
      last.diff = null
      return
    }

    const diff = diffText(prevText, nextText)

    last.diff = {
      path,
      start: diff.start,
      end: diff.end,
      insertText: diff.insertText,
    }

    debug('resolveDOMNode:diff', last.diff)
  }

  /**
   * Remove an Inline DOM Node.
   *
   * Happens when you delete the last character in an Inline DOM Node
   */

  function removeNode(domNode) {
    debug('removeNode')
    if (domNode.nodeType !== window.Node.ELEMENT_NODE) return
    const { value } = editor
    const { document, selection } = value
    const node = editor.findNode(domNode)
    const nodeSelection = document.resolveRange(
      selection.moveToRangeOfNode(node)
    )

    renderSync(editor, () => {
      editor
        .select(nodeSelection)
        .delete()
        .restoreDOM()
    })
  }

  /**
   * handle `onCompositionStart`
   */

  function onCompositionStart() {
    debug('onCompositionStart')
  }

  /**
   * handle `onCompositionEnd`
   */

  function onCompositionEnd() {
    debug('onCompositionEnd')

    /**
     * The timing on the `setTimeout` with `20` ms is sensitive.
     *
     * It cannot use `requestAnimationFrame` because it is too short.
     *
     * Android 9, for example, when you type `it ` the space will first trigger
     * a `compositionEnd` for the `it` part before the mutation for the ` `.
     * This means that we end up with `it` if we trigger too soon because it
     * is on the wrong value.
     */

    window.setTimeout(() => {
      if (last.diff) {
        debug('onCompositionEnd:applyDiff')

        renderSync(editor, () => {
          applyDiff()

          const domRange = win.getSelection().getRangeAt(0)
          const domText = domRange.startContainer.textContent
          const offset = domRange.startOffset

          const fix = fixTextAndOffset(domText, offset)

          const range = editor
            .findRange({
              anchorNode: domRange.startContainer,
              anchorOffset: 0,
              focusNode: domRange.startContainer,
              focusOffset: 0,
              isCollapsed: true,
            })
            .moveTo(fix.offset)

          /**
           * We must call `restoreDOM` even though this is applying a `diff` which
           * should not require it. But if you type `it me. no.` on a blank line
           * with a block following it, the next line will merge with the this
           * line. A mysterious `keydown` with `input` of backspace appears in the
           * event stream which the user not React caused.
           *
           * `focus` is required as well because otherwise we lose focus on hitting
           * `enter` in such a scenario.
           */

          editor
            .select(range)
            .focus()
            .restoreDOM()
        })
      }

      clearAction()
    }, 20)
  }

  /**
   * Handle `onSelect` event
   *
   * Save the selection after a `requestAnimationFrame`
   *
   * - If we're not in the middle of flushing mutations
   * - and cancel save if a mutation runs before the `requestAnimationFrame`
   */

  function onSelect(event) {
    debug('onSelect:try')

    // Event can be Synthetic React or native. Grab only the native one so
    // that we don't have to call `event.perist` for performance.
    event = event.nativeEvent ? event.nativeEvent : event

    window.cancelAnimationFrame(onSelectTimeoutId)
    onSelectTimeoutId = null

    // Don't capture the last selection if the selection was made during the
    // flushing of DOM mutations. This means it is all part of one user action.
    if (isFlushing) return

    onSelectTimeoutId = window.requestAnimationFrame(() => {
      debug('onSelect:save-selection')

      const domSelection = getWindow(event.target).getSelection()
      let range = editor.findRange(domSelection)

      const anchorFix = fixTextAndOffset(
        domSelection.anchorNode.textContent,
        domSelection.anchorOffset
      )

      const focusFix = fixTextAndOffset(
        domSelection.focusNode.textContent,
        domSelection.focusOffset
      )

      if (range.anchor.offset !== anchorFix.offset) {
        range = range.set(
          'anchor',
          range.anchor.set('offset', anchorFix.offset)
        )
      }

      if (range.focus.offset !== focusFix.offset) {
        range = range.set('focus', range.focus.set('offset', focusFix.offset))
      }

      debug('onSelect:save-data', {
        domSelection: normalizeDOMSelection(domSelection),
        range: range.toJS(),
      })

      // If the `domSelection` has moved into a new node, then reconcile with
      // `applyDiff`
      if (
        domSelection.isCollapsed &&
        last.node !== domSelection.anchorNode &&
        last.diff != null
      ) {
        debug('onSelect:applyDiff', last.diff)
        applyDiff()
        editor.select(range)
        clearAction()
      }

      last.range = range
      last.node = domSelection.anchorNode
    })
  }

  return {
    clearDiff,
    connect,
    disconnect,
    onKeyDown: startAction,
    onCompositionStart,
    onCompositionEnd,
    onSelect,
  }
}

function normalizeDOMSelection(selection) {
  return {
    anchorNode: selection.anchorNode,
    anchorOffset: selection.anchorOffset,
    focusNode: selection.focusNode,
    focusOffset: selection.focusOffset,
  }
}

export default CompositionManager
