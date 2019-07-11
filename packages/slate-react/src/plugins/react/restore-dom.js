function RestoreDOMPlugin() {
  /**
   * Makes sure that on the next Content `render` the DOM is restored.
   * This gets us around issues where the DOM is in a different state than
   * React's virtual DOM and would crash.
   *
   * @param {Editor} editor
   */

  function restoreDOM(editor) {
    const tmp = editor.tmp.contentRef.current.tmp
    tmp.contentKey = tmp.contentKey + 1
  }

  return {
    commands: {
      restoreDOM,
    },
  }
}

export default RestoreDOMPlugin
