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
    observer.onCompositionEnd(event)
    isComposing = false
    // setTimeout(() => {
    //   observer.onCompositionEnd(event)
    //   isComposing = false
    // }, 20)
  }

  /**
   * FIXIT:
   *
   * WORKING ON SOMETHING:
   *
   * Hitting enter/backspace doesn't work well once I'm out of mutations.
   *
   * I'm trying to intercept the `input` and `preventDefault`.
   *
   * It's not necessarily having an opportunity to run the mutation diff though.
   *
   * The issue we are trying to solve is so that mutations from Slate don't
   * cause the `composition-manager` to fire changes. So I think we need to
   * capture `render` in the plugin and turn of the listening aspect until
   * render is completed.
   *
   * Note that things are working if we listen to mutations that are happening
   * all the time.
   */

  function onCompositionUpdate(event) {
    observer.onCompositionUpdate(event)
  }
  function onBeforeInput() {}
  function onInput(event) {
    // if (event.nativeEvent.inputType === 'insertLineBreak') {
    //   event.preventDefault()
    //   const selection = editor.findRange(getWindow(event.target).getSelection())
    //   editor.select(selection).splitBlock()
    // } else if (event.nativeEvent.inputType === 'deleteContentBackward') {
    //   event.preventDefault()
    //   editor.deleteBackward().restoreDOM()
    // }
  }
  function onKeyDown() {}
  function onSelect(event, editor, next) {
    const window = getWindow(event.target)
    fixSelectionInZeroWidthBlock(window)
    if (observer == null) return
    observer.onSelect(event)
    next()
  }

  function onComponentDidMount(event) {
    observer.connect(event.target)
  }

  function onComponentDidUpdate(event) {
    observer.connect(event.target)
  }

  function onComponentWillUnmount(event) {
    observer.disconnect()
  }

  function onRender(event) {
    observer.disconnect()
  }

  return {
    onBeforeInput,
    onComponentDidMount,
    onComponentDidUpdate,
    onComponentWillUnmount,
    onCompositionEnd,
    onCompositionStart,
    onCompositionUpdate,
    onInput,
    onKeyDown,
    onRender,
    onSelect,
  }
}

export default MutationPlugin
