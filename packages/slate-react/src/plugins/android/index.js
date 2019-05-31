import getWindow from 'get-window'
import fixSelectionInZeroWidthBlock from './fix-selection-in-zero-width-block'
import CompositionManager from './composition-manager'

function MutationPlugin({ editor }) {
  const observer = new CompositionManager(editor)

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
    observer.connect()
  }

  function onComponentDidUpdate() {
    observer.connect()
  }

  function onComponentWillUnmount(event) {
    observer.disconnect()
  }

  function onRender(event) {
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
