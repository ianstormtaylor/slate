import DOMObserver from './dom-observer'

function MutationPlugin({ editor }) {
  let isComposing = false
  let observer

  // `findDOMNode` does not exist until later so we use `setTimeout`
  setTimeout(() => {
    const rootEl = editor.findDOMNode([])
    observer = new DOMObserver(rootEl)
    observer.start()
  }, 20)

  // function flush(mutations) {
  //   console.log('MUTATIONS!!!', mutations)
  // }

  function onCompositionStart() {
    isComposing = true
  }

  function onCompositionEnd() {
    setTimeout(() => {
      isComposing = false
    }, 20)
  }

  function onCompositionUpdate() {}
  function onBeforeInput() {}
  function onInput() {}
  function onKeyDown() {}
  function onSelect() {}

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
