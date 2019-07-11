import ElementSnapshot from './element-snapshot'
import SELECTORS from '../../constants/selectors'

/**
 * Returns the closest element that matches the selector.
 * Unlike the native `Element.closest` method, this doesn't require the
 * starting node to be an Element.
 *
 * @param  {Node} node to start at
 * @param  {String} css selector to match
 * @return {Element} the closest matching element
 */

function closest(node, selector, win = window) {
  if (node.nodeType === win.Node.TEXT_NODE) {
    node = node.parentNode
  }
  return node.closest(selector)
}

/**
 * A DomSnapshot remembers the state of elements at a given point in time
 * and also remembers the state of the Editor at that time as well.
 * The state can be applied to the DOM at a time in the future.
 */

export default class DomSnapshot {
  /**
   * Constructor.
   *
   * @param {Window} window
   * @param {Editor} editor
   * @param {Boolean} options.before - should we remember the element before the one passed in
   */

  constructor(window, editor, { before = false } = {}) {
    const domSelection = window.getSelection()
    const { anchorNode } = domSelection
    const subrootEl = closest(anchorNode, `${SELECTORS.EDITOR} > *`)
    const elements = [subrootEl]

    // The before option is for when we need to take a snapshot of the current
    // subroot and the element before when the user hits the backspace key.
    if (before) {
      const { previousElementSibling } = subrootEl

      if (previousElementSibling) {
        elements.unshift(previousElementSibling)
      }
    }

    this.snapshot = new ElementSnapshot(elements)
    this.selection = editor.findSelection(domSelection)
  }

  /**
   * Apply the snapshot to the DOM and set the selection in the Editor.
   *
   * @param {Editor} editor
   */

  apply(editor) {
    const { snapshot, selection } = this
    snapshot.apply()
    editor.moveTo(selection.anchor.path, selection.anchor.offset)
  }
}
