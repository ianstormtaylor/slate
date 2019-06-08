/**
 * Makes sure that on the next Content `render` the DOM is restored.
 * This gets us around issues where the DOM is in a different state than
 * React's virtual DOM and would crash.
 */

function RestoreDOMPlugin() {
  return {
    restoreDOM: (fn, editor) => () => {
      editor.setState({ contentKey: editor.state.contentKey + 1 })
    },
  }
}

export default RestoreDOMPlugin
