// import DOMObserver from './dom-observer'
import Debug from 'debug'
import getWindow from 'get-window'
import fixSelectionInZeroWidthBlock from './fix-selection-in-zero-width-block'
import CompositionManager from './composition-manager'

const debug = Debug('slate:mutation-plugin')

function MutationPlugin({ editor }) {
  let observer

  observer = new CompositionManager(editor)

  function onCompositionStart() {
    observer.onCompositionStart()
  }

  function onCompositionEnd() {
    observer.onCompositionEnd()
  }

  function onSelect(event) {
    const window = getWindow(event.target)
    fixSelectionInZeroWidthBlock(window)
    observer.onSelect(event)
  }

  function onComponentDidMount() {
    debug('onComponentDidMount')
    observer.connect()
  }

  function onComponentDidUpdate() {
    debug('onComponentDidUpdate')
    observer.connect()
  }

  function onComponentWillUnmount(event) {
    debug('onComponentWillUnmount')
    observer.disconnect()
  }

  function onRender(event) {
    debug('onRender')
    observer.disconnect()

    // We don't want the `diff` from a previous render to apply to a
    // potentially different value (e.g. when we switch examples)
    observer.clearDiff()
  }

  return {
    onComponentDidMount,
    onComponentDidUpdate,
    onComponentWillUnmount,
    onCompositionEnd,
    onCompositionStart,
    onRender,
    onSelect,
  }
}

export default MutationPlugin
