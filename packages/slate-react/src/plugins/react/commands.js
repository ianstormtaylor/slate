/**
 * A set of commands for the React plugin.
 *
 * @return {Object}
 */

function CommandsPlugin() {
  /**
   * reconcileDOMNode takes text from inside the `domNode` and uses it to set
   * the text inside the matching `node` in Slate.
   *
   * @param {Window} window
   * @param {Editor} editor
   * @param {Node} domNode
   */

  function reconcileDOMNode(editor, domNode) {
    const { value } = editor
    const { document, selection } = value
    const domElement = domNode.parentElement.closest('[data-key]')
    const point = editor.findPoint(domElement, 0)
    const node = document.getDescendant(point.path)
    const block = document.getClosestBlock(point.path)

    // Get text information
    const { text } = node
    let { textContent: domText } = domElement

    const isLastNode = block.nodes.last() === node
    const lastChar = domText.charAt(domText.length - 1)

    // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    if (isLastNode && lastChar === '\n') {
      domText = domText.slice(0, -1)
    }

    // If the text is no different, abort.
    if (text === domText) return

    let entire = selection
      .moveAnchorTo(point.path, 0)
      .moveFocusTo(point.path, text.length)

    entire = document.resolveRange(entire)

    // Change the current value to have the leaf's text replaced.
    editor.insertTextAtRange(entire, domText, node.marks)
    return
  }

  return {
    commands: {
      reconcileDOMNode,
    },
  }
}

export default CommandsPlugin
