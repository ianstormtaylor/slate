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

  const last = {
    diff: null, // {key, startPos, endPos, insertText}
    command: null, // {type, key, pos}
    selection: null, // {key, pos}
    domNode: null, // last DOM node the cursor was in
  }

  function start() {
    // clear()
    window.requestAnimationFrame(() => {
      const rootEl = editor.findDOMNode([])
      win = getWindow(rootEl)
      observer.observe(rootEl, {
        childList: true,
        characterData: true,
        attributes: true,
        subtree: true,
        characterDataOldValue: true,
      })
    })
  }

  function stop() {
    observer.disconnect()
  }

  function clear() {
    last.diff = null
    last.command = null
    last.selection = null
    last.domNode = null
  }

  function applyDiff() {
    const { diff } = last
    if (diff == null) return
    console.log('applyDiff running')
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
    flushControlled(() => {
      applyDiff()
      editor
        .select(last.selection)
        .splitBlock()
        .restoreDOM()
    })
  }

  function mergeBlock() {
    flushControlled(() => {
      applyDiff()
      editor
        .select(last.selection)
        .deleteBackward(1)
        .restoreDOM()
    })
  }

  function flush(mutations) {
    if (!mutations) mutations = observer.takeRecords()
    stop()
    let firstMutation = mutations[0]

    if (firstMutation.type === 'characterData') {
      console.log('characterData', Array.from(mutations))
      resolveMutation(firstMutation)
    } else if (firstMutation.type === 'childList') {
      if (firstMutation.removedNodes.length > 0) {
        if (mutations.length === 1) {
          removeNode(firstMutation.removedNodes[0])
        } else {
          // backspace
          mergeBlock()
        }
      } else if (firstMutation.addedNodes.length > 0) {
        // hit enter in a block
        splitBlock()
      }
    }
    start()
  }

  function resolveMutation(m) {
    const { value } = editor
    const { document, selection } = value
    const { target } = m
    const domElement = target.parentNode
    const node = editor.findNode(domElement)
    const path = document.getPath(node.key)
    const block = document.getClosestBlock(node.key)
    // const prevText = m.oldValue
    const prevText = node.text
    let nextText = target.textContent
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

    // If the text is no different, abort.
    if (nextText === prevText) return

    const diff = diffText(prevText, nextText)

    last.diff = {
      path,
      start: diff.start,
      end: diff.end,
      insertText: diff.insertText,
    }
  }

  function removeNode(domNode) {
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
    start()
  }

  function onCompositionUpdate() {
    debug('onCompositionUpdate')
  }

  function onCompositionEnd() {
    debug('onCompositionEnd')
    stop()
    applyDiff()
    clear()
  }

  function onSelect(event) {
    debug('onSelect')
    const domSelection = getWindow(event.target).getSelection()
    const range = editor.findRange(domSelection)
    if (last.node !== domSelection.anchorNode && last.diff != null) {
      debug('onSelect:applyDiff')
      applyDiff()
      editor.select(range)
      clear()
    }
    last.selection = range
    last.node = domSelection.anchorNode
  }

  return {
    start,
    stop,
    onCompositionStart,
    onCompositionEnd,
    onCompositionUpdate,
    onSelect,
  }
}

export default CompositionManager
