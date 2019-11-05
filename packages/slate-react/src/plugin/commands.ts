import { Editor } from 'slate'
import { IS_FOCUSED } from '../utils/weak-maps'
import { ReactEditor } from '.'
import { removeAllRanges } from '../utils/dom'
import { Utils } from '../utils/utils'

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
   * Insert a `DataTransfer` object.
   */

  insertDataTransfer(this: ReactEditor, dataTransfer: DataTransfer) {
    const fragment = Utils.getFragmentData(dataTransfer)

    if (fragment) {
      this.insertFragment(fragment)
      return
    }

    const text = dataTransfer.getData('text/plain')

    if (text) {
      const lines = text.split('\n')
      let split = false

      for (const line of lines) {
        if (split) {
          this.splitNodes()
        }

        this.insertText(line)
        split = true
      }
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
