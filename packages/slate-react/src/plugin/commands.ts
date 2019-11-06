import { Editor, Range } from 'slate'

import Hotkeys from '../utils/hotkeys'
import { IS_FOCUSED } from '../utils/weak-maps'
import { ReactEditor } from '.'
import { Utils } from '../utils/utils'
import { NativeStaticRange } from '../utils/dom'

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
      domSelection.removeAllRanges()
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

  insertData(this: ReactEditor, dataTransfer: DataTransfer) {
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
   * Transform an `InputEvent` into commands on the editor.
   */

  onBeforeInput(
    this: ReactEditor,
    event: Event & {
      data: string | null
      dataTransfer: DataTransfer | null
      getTargetRanges(): NativeStaticRange[]
      inputType: string
      isComposing: boolean
    }
  ) {
    const { inputType, data, dataTransfer } = event

    // Each of these input types reflects specific user intent, and most of them
    // are cancellable so we can perform the action on the Slate model direclty.
    // https://w3c.github.io/input-events/#dom-inputevent-inputtype
    switch (inputType) {
      case 'deleteByComposition':
      case 'deleteByCut':
      case 'deleteByDrag':
      case 'deleteContent':
      case 'deleteContentForward': {
        this.delete()
        break
      }

      case 'deleteContentBackward': {
        this.delete({ reverse: true })
        break
      }

      case 'deleteEntireSoftLine': {
        this.delete({ unit: 'line', reverse: true })
        this.delete({ unit: 'line' })
        break
      }

      case 'deleteSoftLineBackward':
      case 'deleteHardLineBackward': {
        this.delete({ unit: 'line', reverse: true })
        break
      }

      case 'deleteSoftLineForward':
      case 'deleteHardLineForward': {
        this.delete({ unit: 'line' })
        break
      }

      case 'deleteWordBackward': {
        this.delete({ unit: 'word', reverse: true })
        break
      }

      case 'deleteWordForward': {
        this.delete({ unit: 'word' })
        break
      }

      case 'historyRedo': {
        this.redo()
        break
      }

      case 'historyUndo': {
        this.undo()
        break
      }

      case 'insertLineBreak':
      case 'insertParagraph': {
        this.splitNodes({ always: true })
        break
      }

      case 'insertFromComposition':
      case 'insertFromDrop':
      case 'insertFromPaste':
      case 'insertFromYank':
      case 'insertReplacementText':
      case 'insertText': {
        if (dataTransfer != null) {
          this.insertData(dataTransfer)
        } else if (data != null) {
          this.insertText(data)
        }

        break
      }
    }
  }

  /**
   * Transform a `KeyboardEvent` into commands on the editor. This should only
   * be used for hotkeys which attach specific commands to specific key
   * combinations. Most input logic will be handled by the `onBeforeInput`
   * method instead.
   */

  onKeyDown(this: ReactEditor, event: KeyboardEvent) {
    // COMPAT: Since we prevent the default behavior on `beforeinput` events,
    // the browser doesn't think there's ever any history stack to undo or redo,
    // so we have to manage these hotkeys ourselves. (2019/11/06)
    if (Hotkeys.isRedo(event)) {
      this.redo()
      return
    }

    if (Hotkeys.isUndo(event)) {
      this.undo()
      return
    }

    // COMPAT: Certain browsers don't handle the selection updates
    // properly. In Chrome, the selection isn't properly extended.
    // And in Firefox, the selection isn't properly collapsed.
    // (2017/10/17)
    if (Hotkeys.isMoveLineBackward(event)) {
      event.preventDefault()
      this.move({ unit: 'line', reverse: true })
      return
    }

    if (Hotkeys.isMoveLineForward(event)) {
      event.preventDefault()
      this.move({ unit: 'line' })
      return
    }

    if (Hotkeys.isExtendLineBackward(event)) {
      event.preventDefault()
      this.move({ unit: 'line', edge: 'focus', reverse: true })
      return
    }

    if (Hotkeys.isExtendLineForward(event)) {
      event.preventDefault()
      this.move({ unit: 'line', edge: 'focus' })
      return
    }

    // COMPAT: If a void node is selected, or a zero-width text node
    // adjacent to an inline is selected, we need to handle these
    // hotkeys manually because browsers won't be able to skip over
    // the void node with the zero-width space not being an empty
    // string.
    if (Hotkeys.isMoveBackward(event)) {
      const { selection } = this.value
      event.preventDefault()

      if (selection && Range.isCollapsed(selection)) {
        this.move({ reverse: true })
      } else {
        this.collapse({ edge: 'start' })
      }

      return
    }

    if (Hotkeys.isMoveForward(event)) {
      const { selection } = this.value
      event.preventDefault()

      if (selection && Range.isCollapsed(selection)) {
        this.move()
      } else {
        this.collapse({ edge: 'end' })
      }

      return
    }

    if (Hotkeys.isMoveWordBackward(event)) {
      event.preventDefault()
      this.move({ unit: 'word', reverse: true })
      return
    }

    if (Hotkeys.isMoveWordForward(event)) {
      event.preventDefault()
      this.move({ unit: 'word' })
      return
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
