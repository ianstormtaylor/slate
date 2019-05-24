// import DOMObserver from './dom-observer'
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

  function onCompositionStart() {
    isComposing = true
    observer.onCompositionStart()
  }

  function onCompositionEnd() {
    setTimeout(() => {
      observer.onCompositionEnd()
      isComposing = false
    }, 20)
  }

  function onCompositionUpdate() {
    observer.onCompositionUpdate()
  }
  function onBeforeInput() {}
  function onInput() {}
  function onKeyDown() {}
  function onSelect(event) {
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
