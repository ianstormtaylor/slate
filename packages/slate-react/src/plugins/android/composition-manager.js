import Debug from 'debug'
import getWindow from 'get-window'
import ReactDOM from 'react-dom'

import diffText from './diff-text'
import { tmpdir } from 'os'

const debug = Debug('slate:composition-manager')

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

  // function start() {
  //   // window.requestAnimationFrame(() => {
  //   //   const rootEl = editor.findDOMNode([])
  //   //   debug('start:run', { rootEl })
  //   //   win = getWindow(rootEl)
  //   //   observer.observe(rootEl, {
  //   //     childList: true,
  //   //     characterData: true,
  //   //     attributes: true,
  //   //     subtree: true,
  //   //     characterDataOldValue: true,
  //   //   })
  //   // })
  // }

  // start()

  // function stop() {
  //   observer.disconnect()
  // }

  function clear() {
    last.diff = null
    last.command = null
    last.domNode = null
  }

  function applyDiff() {
    const { diff } = last
    if (diff == null) return
    console.log('applyDiff:run')
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
    debug('splitBlock')

    disconnect()

    flushControlled(() => {
      applyDiff()
      if (last.selection) {
        editor.select(last.selection)
      } else {
        debug('splitBlock:NO-SELECTION')
      }
      editor.splitBlock().restoreDOM()
    })
  }

  function mergeBlock() {
    debug('mergeBlock')

    disconnect()

    const lastSelection = last.selection

    win.requestAnimationFrame(() => {
      console.log('selection at mergeBlock', last.selection.toJSON())
      applyDiff()
      editor
        .select(lastSelection)
        .deleteBackward()
        .restoreDOM()
    })
  }

  function flush(mutations) {
    if (!mutations) mutations = observer.takeRecords()
    debug('flush', mutations.length, mutations)
    // stop()
    let firstMutation = mutations[0]

    if (firstMutation.type === 'characterData') {
      resolveMutation(firstMutation)
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
    let nextText = domNode.textContent
    debug('characterData', {
      prevText,
      nextText,
      node: node.toJS(),
      path: path.toJS(),
      block: block.toJS(),
    })

    const isLastNode = block.nodes.last() === node
    const lastChar = nextText.charAt(nextText.length - 1)

    // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    if (isLastNode && lastChar === '\n') {
      nextText = nextText.slice(0, -1)
    }

    let cursorOffset = getDOMRange().startOffset

    // FIXIT:
    // Make sure the char 65279 (zero width space) is removed from the text.

    const firstCharCode = nextText.charCodeAt(0)
    if (firstCharCode === 65279) {
      nextText = nextText.slice(1)
      cursorOffset--
      debug('FOUND - ZERO WIDTH', {
        prevText,
        nextText,
        prevLength: prevText.length,
        nextLength: nextText.length,
      })
    } else {
      debug('NO - ZERO WIDTH', { prevText, nextText })
    }

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
      cursorOffset,
      startOffset: getDOMRange().startOffset,
      range: getRange(),
    }
    debug('resolveDOMNode:last.diff.range', last.diff)
  }

  function resolveMutation(m) {
    debug('resolve')
    const domNode = m.target.parentNode
    resolveDOMNode(domNode)
  }

  function removeNode(domNode) {
    debug('removeNode')
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
      applyDiff({ select: true })

      const domRange = win.getSelection().getRangeAt(0)
      const domText = domRange.startContainer.textContent
      let offset = domRange.startOffset
      // const hasZeroWidth = domText.charCodeAt(0) === 65279
      // if (hasZeroWidth) {
      //   offset--
      // }
      // debug('onCompositionEnd', {
      //   domText,
      //   hasZeroWidth,
      //   offset,
      // })

      const range = editor
        .findRange({
          anchorNode: domRange.startContainer,
          anchorOffset: 0,
          focusNode: domRange.startContainer,
          anchorOffset: 0,
          isCollapsed: true,
        })
        .moveTo(offset)

      // const range = editor.findRange(win.getSelection())
      editor.select(range)
    }

    clear()
    // const range = getRange(event)
    // applyDiff()
    // editor.select(range)
    // clear()
  }

  function onSelect(event) {
    const domSelection = getWindow(event.target).getSelection()
    const range = editor.findRange(domSelection)
    debug('onSelect', { domSelection, range: range.toJS() })
    if (last.node !== domSelection.anchorNode && last.diff != null) {
      debug('onSelect:applyDiff', last.diff)
      applyDiff()
      editor.select(range)
      clear()
    }
    debug('onSelect', {
      editorSelection: editor.value.selection.toJSON(),
      range: range.toJSON(),
    })
    last.selection = range
    last.node = domSelection.anchorNode
  }

  return {
    // start,
    // stop,
    connect,
    disconnect,
    onCompositionStart,
    onCompositionEnd,
    onCompositionUpdate,
    onSelect,
  }
}

export default CompositionManager
