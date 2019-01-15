import closest from './closest'
import getSelectionFromDom from './get-selection-from-dom'
import ElementSnapshot from './element-snapshot'

export default class SlateSnapshot {
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

  apply(editor) {
    if (editor == null) throw new Error('editor is required')
    const { snapshot, selection } = this
    snapshot.apply()
    editor.moveTo(selection.anchor.key, selection.anchor.offset)
  }
}
