import getWindow from 'get-window'
import CompositionManager from './composition-manager'

/**
 * Fixes a selection within the DOM when the cursor is in Slate's special
 * zero-width block. Slate handles empty blocks in a special manner and the
 * cursor can end up either before or after the non-breaking space. This
 * causes different behavior in Android and so we make sure the seleciton is
 * always before the zero-width space.
 *
 * @param {Window} window
 */

function fixSelectionInZeroWidthBlock(window) {
  const domSelection = window.getSelection()
  const { anchorNode } = domSelection
  if (anchorNode == null) return
  const { dataset } = anchorNode.parentElement
  const isZeroWidth = dataset ? dataset.slateZeroWidth === 'n' : false

  if (
    isZeroWidth &&
    anchorNode.textContent.length === 1 &&
    domSelection.anchorOffset !== 0
  ) {
    const range = window.document.createRange()
    range.setStart(anchorNode, 0)
    range.setEnd(anchorNode, 0)
    domSelection.removeAllRanges()
    domSelection.addRange(range)
  }
}

/**
 * Android Plugin
 *
 * @param {Editor} options.editor
 */

function AndroidPlugin({ editor }) {
  const observer = new CompositionManager(editor)

  /**
   * handle `onCompositionStart`
   */

  function onCompositionStart() {
    observer.onCompositionStart()
  }

  /**
   * handle `onCompositionEnd`
   */

  function onCompositionEnd() {
    observer.onCompositionEnd()
  }

  /**
   * handle `onSelect`
   *
   * @param {Event} event
   */

  function onSelect(event) {
    const window = getWindow(event.target)
    fixSelectionInZeroWidthBlock(window)
    observer.onSelect(event)
  }

  /**
   * handle `onComponentDidMount`
   */

  function onComponentDidMount() {
    observer.connect()
  }

  /**
   * handle `onComponentDidUpdate`
   */

  function onComponentDidUpdate() {
    observer.connect()
  }

  /**
   * handle `onComponentWillUnmount`
   *
   * @param {Event} event
   */

  function onComponentWillUnmount() {
    observer.disconnect()
  }

  /**
   * handle `onRender`
   *
   * @param {Event} event
   */

  function onRender() {
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

export default AndroidPlugin
