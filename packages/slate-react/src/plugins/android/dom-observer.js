function normalizeMutation(mut) {
  console.log(mut)
  return mut
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

function DOMObserver(element) {
  const observer = new window.MutationObserver(flush)

  const mutations = []

  function start() {
    console.log('STARTTTT!!!', element)
    observer.observe(element, {
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
    console.log('FLUSH THE MUTATIONS!!!')
    if (!mutations) mutations = observer.takeRecords()

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
    // if (from > -1 || newSel) {
    //   if (from > -1) this.view.docView.markDirty(from, to)
    //   this.handleDOMChange(from, to, typeOver)
    //   if (this.view.docView.dirty) this.view.updateState(this.view.state)
    //   else if (!this.currentSelection.eq(sel)) selectionToDOM(this.view)
    // }
  }

  function register(m) {
    console.log('REGISTERED', m)
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
