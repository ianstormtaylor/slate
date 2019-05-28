import Debug from 'debug'
import getWindow from 'get-window'
import ReactDOM from 'react-dom'

import diffText from './diff-text'
import { tmpdir } from 'os'

const debug = Debug('slate:composition-manager')

const ZERO_WIDTH_SPACE = 65279
const ZERO_WIDTH_SPACE_CHAR = String.fromCharCode(ZERO_WIDTH_SPACE)

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
  // console.log('fixTextAndOffset', {
  //   nextText,
  //   nextOffset,
  //   type: typeof nextText,
  //   length: nextText.length,
  // })
  while (index !== -1) {
    index = nextText.indexOf(ZERO_WIDTH_SPACE_CHAR, index)
    if (index === -1) break
    if (nextOffset > index) nextOffset--
    // console.log('loop', {
    //   nextText,
    //   type: typeof nextText,
    //   length: nextText.length,
    // })
    // nextText = nextText.splice(index, 1)
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
 * https://github.com/facebook/draft-js/commit/cda13cb8ff9c896cdb9ff832d1edeaa470d3b871
 */

const flushControlled = ReactDOM.unstable_flushControlled
// const flushControlled = ReactDOM.flushSync

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
  const observer = new window.MutationObserver(flush)

  let win = null

  let isComposing = false

  let isListening = false

  /**
   * Range when the last `onInput` event occurred.
   *
   * @type {Range}
   */

  let lastLastRange = null

  let lastEl = null

  const last = {
    diff: null, // {key, startPos, endPos, insertText}
    command: null, // {type, key, pos}
    selection: null, // {key, pos}
    domNode: null, // last DOM node the cursor was in
  }

  function connect(el) {
    if (lastEl === el) return
    debug('connect')
    win = getWindow(el)
    observer.observe(el, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true,
    })
    isListening = true
  }

  function disconnect() {
    debug('disconnect')
    observer.disconnect()
  }

  function clear() {
    last.diff = null
    last.command = null
    last.domNode = null
  }

  function applyDiff() {
    debug('applyDiff')
    const { diff } = last
    if (diff == null) return
    debug('applyDiff:run')
    const { document, selection } = editor.value

    let entire = editor.value.selection
      .moveAnchorTo(diff.path, diff.start)
      .moveFocusTo(diff.path, diff.end)

    entire = document.resolveRange(entire)

    editor.insertTextAtRange(entire, diff.insertText)
  }

  function applySelection() {
    editor.select(last.selection)
  }

  function splitBlock() {
    debug('splitBlock', { selection: last.selection.toJSON() })

    flushControlled(() => {
      applyDiff()
      if (last.selection) {
        editor.select(last.selection)
      } else {
        debug('splitBlock:NO-SELECTION')
      }
      editor.splitBlock().restoreDOM()
      clear()
    })
  }

  function mergeBlock() {
    debug('mergeBlock')

    const lastSelection = last.selection

    // The delay is required because hitting `enter`, `enter` then `backspace`
    // in a word results in the cursor being one position to the right. Slate
    // correctly sets the position to `0` and we have even checked it
    // immediately after setting it, but upon next read it will be in the
    // wrong position. This happens only when using the virtual keyboard.
    // Hitting enter on a hardware keyboard does not trigger this bug.

    win.requestAnimationFrame(() => {
      console.log('selection at mergeBlock', last.selection.toJSON())
      applyDiff()
      editor
        .select(lastSelection)
        .deleteBackward()
        .restoreDOM()
      clear()
    })
  }

  function flush(mutations) {
    if (!mutations) mutations = observer.takeRecords()
    debug('flush', mutations.length, mutations)

    console.log('last.selection', last.selection, last.selection.toJSON())
    if (last.range && !last.range.isCollapsed) {
      console.log('delete selection')
      flushControlled(() => {
        editor
          .select(last.range)
          .deleteBackward()
          .focus()
          .restoreDOM()
      })
      return
    } else {
      console.log('do not delete selection')
    }

    let firstMutation = mutations[0]

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
    // start()
  }

  function resolveDOMNode(domNode) {
    const { value } = editor
    const { document, selection } = value
    const domElement = domNode.parentNode
    const node = editor.findNode(domElement)
    const path = document.getPath(node.key)
    const block = document.getClosestBlock(node.key)
    // const prevText = m.oldValue
    const prevText = node.text
    // let nextText = domNode.textContent

    // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    const isLastNode = block.nodes.last() === node

    const fix = fixTextAndOffset(
      domNode.textContent,
      getDOMRange().startOffset,
      isLastNode
    )

    const nextText = fix.text
    const nextOffset = fix.offset

    debug('resolveDOMNode', {
      prevText,
      nextText,
      nextOffset,
      node: node.toJS(),
      path: path.toJS(),
      block: block.toJS(),
    })

    // const lastChar = nextText.charAt(nextText.length - 1)
    // if (isLastNode && lastChar === '\n') {
    //   nextText = nextText.slice(0, -1)
    // }

    // console.log({ nextText, length: nextText.length })

    // // nextText = fixDOMText(nextText)

    // // If the last character is a zero width then remove it. This is because
    // // the user started typing in an empty block.
    // const lastCharCode = nextText.charCodeAt(nextText.length - 1)
    // if (lastCharCode === ZERO_WIDTH_SPACE) {
    //   nextText = nextText.slice(0, -1)
    // }

    // console.log({ lastCharCode, nextText, length: nextText.length })

    // let cursorOffset = getDOMRange().startOffset

    // // FIXIT:
    // // Make sure the char 65279 (zero width space) is removed from the text.

    // const firstCharCode = nextText.charCodeAt(0)
    // if (firstCharCode === ZERO_WIDTH_SPACE) {
    //   nextText = nextText.slice(1)
    //   cursorOffset--
    //   debug('FOUND - ZERO WIDTH', {
    //     prevText,
    //     nextText,
    //     prevLength: prevText.length,
    //     nextLength: nextText.length,
    //   })
    // } else {
    //   debug('NO - ZERO WIDTH', { prevText, nextText })
    // }

    // If the text is no different, abort.
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
      // cursorOffset,
      // startOffset: getDOMRange().startOffset,
      // range: getRange(),
    }
    debug('resolveDOMNode:last.diff.range', last.diff)
  }

  // function resolveMutation(m) {
  //   debug('resolveMutation')
  //   const domNode = m.target.parentNode
  //   resolveDOMNode(domNode)
  // }

  const ELEMENT_NODE = 1
  const TEXT_NODE = 3

  function removeNode(domNode) {
    debug('removeNode')
    if (domNode.nodeType !== ELEMENT_NODE) return
    const { value } = editor
    const { document, selection } = value
    const node = editor.findNode(domNode)
    const nodeSelection = document.resolveRange(
      selection.moveToRangeOfNode(node)
    )
    editor.select(nodeSelection).delete()
    editor.restoreDOM()
    editor.controller.flush()
  }

  function onCompositionStart() {
    debug('onCompositionStart')
    isComposing = true
  }

  function onCompositionUpdate() {
    debug('onCompositionUpdate')
  }

  function getDOMRange() {
    return win.getSelection().getRangeAt(0)
  }

  function getRange() {
    const domSelection = win.getSelection()
    const range = editor.findRange(domSelection)
    console.log('getRange', { domSelection, range })
    return range
  }

  function onCompositionEnd(event) {
    debug('onCompositionEnd')
    isComposing = false

    if (last.diff) {
      debug('onCompositionEnd:applyDiff')
      applyDiff({ select: true })

      const domRange = win.getSelection().getRangeAt(0)
      const domText = domRange.startContainer.textContent
      let offset = domRange.startOffset

      /**
       * TODO:
       *
       * The next step I think is that we need to get a general `findRange`
       * method that works with unresolved nodes. We need to remove the
       * ZERO_WIDTH_SPACE at the appropriate points for the `textNode`
       * keeping in mind that if the space is before, e need to offset the
       * anchor and if the space is after we don't and the max offset is
       * the length of the text after the spaces are removed.
       */

      const range = editor
        .findRange({
          anchorNode: domRange.startContainer,
          anchorOffset: 0,
          focusNode: domRange.startContainer,
          anchorOffset: 0,
          isCollapsed: true,
        })
        .moveTo(offset)

      // We must call `restoreDOM` even though this is applying a `diff` which
      // should not require it. But if you type `it me. no.` on a blank line
      // with a block following it, the next line will merge with the this
      // line. A mysterious `keydown` with `input` of backspace appears in the
      // event stream which the user not React caused.
      //
      // `focus` is required as well because otherwise we lose focus on hitting
      // `enter` in such a scenario.

      editor
        .select(range)
        .focus()
        .restoreDOM()
    }

    clear()
  }

  function onSelect(event) {
    const domSelection = getWindow(event.target).getSelection()
    let range = editor.findRange(domSelection)

    const anchorFix = fixTextAndOffset(
      domSelection.anchorNode.textContent,
      domSelection.anchorOffset
    )

    const focusFix = fixTextAndOffset(
      domSelection.anchorNode.textContent,
      domSelection.anchorOffset
    )

    if (range.anchor.offset !== anchorFix.offset) {
      range = range.set('anchor', range.anchor.set('offset', anchorFix.offset))
    }
    if (range.focus.offset !== focusFix.offset) {
      range = range.set('focus', range.focus.set('offset', focusFix.offset))
    }

    debug('onSelect', {
      editorSelection: editor.value.selection.toJS(),
      domSelection: normalizeDOMSelection(domSelection),
      range: range.toJS(),
      last,
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
      clear()
    }

    lastLastRange = last.selection
    last.selection = range
    last.node = domSelection.anchorNode
  }

  return {
    connect,
    disconnect,
    onCompositionStart,
    onCompositionEnd,
    onCompositionUpdate,
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

// function fixDOMText(text) {
//   if (text.charCodeAt(text.length - 1) === ZERO_WIDTH_SPACE) {
//     return text.slice(0, -1)
//   }
//   return text
// }

// function textStartsWithZeroWidth(s) {
//   return s.charCodeAt(0) === ZERO_WIDTH_SPACE
// }

// function textEndsWithZeroWidth(s) {
//   return s.charCodeAt(s - 1) === ZERO_WIDTH_SPACE
// }

export default CompositionManager
