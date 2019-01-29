import closest from './closest'
import getSelectionFromDom from './get-selection-from-dom'
import ElementSnapshot from './element-snapshot'

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
    const subrootEl = closest(anchorNode, '[data-slate-editor] > *')
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
    this.selection = getSelectionFromDom(window, editor, domSelection)
  }

  /**
   * Apply the snapshot to the DOM and set the selection in the Editor.
   *
   * @param {Editor} editor
   */

  apply(editor) {
    const { snapshot, selection } = this
    snapshot.apply()
    editor.moveTo(selection.anchor.key, selection.anchor.offset)
  }
}
