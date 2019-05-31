// import DOMObserver from './dom-observer'
import Debug from 'debug'
import getWindow from 'get-window'
import fixSelectionInZeroWidthBlock from './fix-selection-in-zero-width-block'
import CompositionManager from './composition-manager'

const debug = Debug('slate:mutation-plugin')

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
    // observer.onCompositionEnd(event)
    // isComposing = false
    // setTimeout(() => {
    observer.onCompositionEnd(event)
    isComposing = false
    // }, 20)
  }

  function onKeyDown() {}
  function onSelect(event, editor, next) {
    const window = getWindow(event.target)
    fixSelectionInZeroWidthBlock(window)
    // if (observer == null) return
    observer.onSelect(event)
    next()
  }

  function onComponentDidMount(event) {
    debug('onComponentDidMount')
    const rootEl = editor.findDOMNode([])
    observer.connect(rootEl)
  }

  function onComponentDidUpdate(event) {
    debug('onComponentDidUpdate')
    const rootEl = editor.findDOMNode([])
    observer.connect(rootEl)
  }

  function onComponentWillUnmount(event) {
    debug('onComponentWillUnmount')
    observer.disconnect()
  }

  function onRender(event) {
    debug('onRender')
    observer.disconnect()
    observer.onRender()
  }

  return {
    onComponentDidMount,
    onComponentDidUpdate,
    onComponentWillUnmount,
    onCompositionEnd,
    onCompositionStart,
    onKeyDown,
    onRender,
    onSelect,
  }
}

export default MutationPlugin
