import Debug from 'debug'
import ReactDOM from 'react-dom'

import diffText from './diff-text'

const debug = Debug('slate:dom-observer')

function normalizeMutation(mut) {
  console.log(mut)
  return mut
}

/**
 * https://github.com/facebook/draft-js/commit/cda13cb8ff9c896cdb9ff832d1edeaa470d3b871
 */

// const flushControlled = ReactDOM.unstable_flushControlled
const flushControlled = ReactDOM.flushSync

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

function DOMObserver(editor, element) {
  const observer = new window.MutationObserver(flush)

  const mutations = []

  function start() {
    const rootEl = editor.findDOMNode([])
    observer.observe(rootEl, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true,
    })
  }

  function stop() {
    observer.disconnect()
  }

  function clear() {
    mutations.length = 0
  }

  function flush(mutations) {
    if (!mutations) mutations = observer.takeRecords()
    stop()

    try {
      // flushControlled(() => {
      let from = -1,
        to = -1,
        typeOver = false
      for (let i = 0; i < mutations.length; i++) {
        let result = register(mutations[i])
        if (result) {
          from = from < 0 ? result.from : Math.min(result.from, from)
          to = to < 0 ? result.to : Math.max(result.to, to)
          if (result.typeOver) typeOver = true
        }
      }
      // })
      console.log('after flushControlled')
    } finally {
      // restart even if `render` crashes
      start()
    }

    // if (from > -1 || newSel) {
    //   if (from > -1) this.view.docView.markDirty(from, to)
    //   this.handleDOMChange(from, to, typeOver)
    //   if (this.view.docView.dirty) this.view.updateState(this.view.state)
    //   else if (!this.currentSelection.eq(sel)) selectionToDOM(this.view)
    // }
  }

  function removeNode(domNode) {
    console.log('removeNode')
    // ReactDOM.flushSync(() => {
    const { value } = editor
    const { document, selection } = value
    const node = editor.findNode(domNode)
    const nodeSelection = document.resolveRange(
      selection.moveToRangeOfNode(node)
    )
    editor.select(nodeSelection).delete()
    editor.restoreDOM()
    editor.controller.flush()
    console.log('after flush sync?')
    // })
    // console.log('after flushSync')
  }

  function register(m) {
    switch (m.type) {
      case 'childList':
        m.removedNodes.forEach(domNode => removeNode(domNode))

        break
      case 'characterData':
        const { value } = editor
        const { document, selection } = value
        const { target } = m
        const prevText = m.oldValue
        let nextText = target.textContent
        const domElement = target.parentNode
        const node = editor.findNode(domElement)
        const path = document.getPath(node.key)
        const block = document.getClosestBlock(node.key)
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

        let entire = selection
          .moveAnchorTo(path, diff.start)
          .moveFocusTo(path, diff.end)

        entire = document.resolveRange(entire)

        // Change the current value to have the leaf's text replaced.
        editor.insertTextAtRange(entire, diff.insertText, node.marks)

        entire = entire.moveTo(path, diff.cursor)

        editor.select(entire)

        // let entire = selection
        //   .moveAnchorTo(path, 0)
        //   .moveFocusTo(path, prevText.length)

        // entire = document.resolveRange(entire)

        // // Change the current value to have the leaf's text replaced.
        // editor.insertTextAtRange(entire, nextText, node.marks)

        break
    }

    // function reconcileNode(editor, node) {
    //   const { value } = editor
    //   const { document, selection } = value
    //   const path = document.getPath(node.key)

    //   const domElement = editor.findDOMNode(path)
    //   const block = document.getClosestBlock(path)

    //   // Get text information
    //   const { text } = node
    //   let { textContent: domText } = domElement

    //   const isLastNode = block.nodes.last() === node
    //   const lastChar = domText.charAt(domText.length - 1)

    //   // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    //   // we will have added another new line in <Leaf>'s render method to account
    //   // for browsers collapsing a single trailing new lines, so remove it.
    //   if (isLastNode && lastChar === '\n') {
    //     domText = domText.slice(0, -1)
    //   }

    //   // If the text is no different, abort.
    //   if (text === domText) return

    //   let entire = selection.moveAnchorTo(path, 0).moveFocusTo(path, text.length)

    //   entire = document.resolveRange(entire)

    //   // Change the current value to have the leaf's text replaced.
    //   editor.insertTextAtRange(entire, domText, node.marks)
    //   return
    // }

    //   let desc = this.view.docView.nearestDesc(mut.target)
    //   if (
    //     mut.type == "attributes" &&
    //     (desc == this.view.docView || mut.attributeName == "contenteditable")
    //   )
    //     return null
    //   if (!desc || desc.ignoreMutation(mut)) return null
    //   if (mut.type == "childList") {
    //     let fromOffset =
    //       mut.previousSibling && mut.previousSibling.parentNode == mut.target
    //         ? domIndex(mut.previousSibling) + 1
    //         : 0
    //     let from = desc.localPosFromDOM(mut.target, fromOffset, -1)
    //     let toOffset =
    //       mut.nextSibling && mut.nextSibling.parentNode == mut.target
    //         ? domIndex(mut.nextSibling)
    //         : mut.target.childNodes.length
    //     let to = desc.localPosFromDOM(mut.target, toOffset, 1)
    //     return { from, to }
    //   } else if (mut.type == "attributes") {
    //     return {
    //       from: desc.posAtStart - desc.border,
    //       to: desc.posAtEnd + desc.border,
    //     }
    //   } else {
    //     // "characterData"
    //     return {
    //       from: desc.posAtStart,
    //       to: desc.posAtEnd,
    //       // An event was generated for a text change that didn't change
    //       // any text. Mark the dom change to fall back to assuming the
    //       // selection was typed over with an identical value if it can't
    //       // find another change.
    //       typeOver: mut.target.nodeValue == mut.oldValue,
    //     }
  }

  /**
   * Get mutations since last started or cleared
   *
   * @returns {Object[]}
   */

  function get() {
    flush()
    return mutations
  }
  return { start, stop, get }
}

export default DOMObserver
