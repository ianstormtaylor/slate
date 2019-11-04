import { Editor } from 'slate'
import { IS_FOCUSED } from '../utils/weak-maps'
import { ReactEditor } from '.'
import { removeAllRanges } from '../utils/dom'

export default class ReactEditorCommands {
  /**
   * Blur the editor.
   */

  blur(this: ReactEditor) {
    const el = this.toDomNode(this.value)
    IS_FOCUSED.set(this, false)

    if (window.document.activeElement === el) {
      el.blur()
    }
  }

  /**
   * Focus the editor.
   */

  focus(this: ReactEditor) {
    const el = this.toDomNode(this.value)
    IS_FOCUSED.set(this, true)

    if (window.document.activeElement !== el) {
      el.focus({ preventScroll: true })
    }
  }

  /**
   * Deselect the editor.
   */

  deselect(this: Editor) {
    const { selection } = this.value
    const domSelection = window.getSelection()

    if (domSelection && domSelection.rangeCount > 0) {
      removeAllRanges(domSelection)
    }

    if (selection) {
      this.apply({
        type: 'set_selection',
        properties: selection,
        newProperties: null,
      })
    }
  }

  /**
   * Redo.
   */

  redo(this: ReactEditor) {}

  /**
   * Undo.
   */

  undo(this: ReactEditor) {}
}
