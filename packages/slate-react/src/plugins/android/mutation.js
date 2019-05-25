// import DOMObserver from './dom-observer'
import getWindow from 'get-window'
import fixSelectionInZeroWidthBlock from './fix-selection-in-zero-width-block'
import CompositionManager from './composition-manager'

function MutationPlugin({ editor }) {
  let isComposing = false
  let observer

  // `findDOMNode` does not exist until later so we use `setTimeout`
  // setTimeout(() => {
  observer = new CompositionManager(editor)
  // observer.start()
  //   observer.start()
  // }, 20)

  // function flush(mutations) {
  //   console.log('MUTATIONS!!!', mutations)
  // }

  function onCompositionStart(event) {
    isComposing = true
    observer.onCompositionStart(event)
  }

  function onCompositionEnd(event) {
    event.persist()
    setTimeout(() => {
      observer.onCompositionEnd(event)
      isComposing = false
    }, 20)
  }

  function onCompositionUpdate(event) {
    observer.onCompositionUpdate(event)
  }
  function onBeforeInput() {}
  function onInput() {}
  function onKeyDown() {}
  function onSelect(event) {
    const window = getWindow(event.target)
    fixSelectionInZeroWidthBlock(window)
    if (observer == null) return
    observer.onSelect(event)
  }

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

export default MutationPlugin
