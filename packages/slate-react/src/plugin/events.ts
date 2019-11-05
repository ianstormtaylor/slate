import { Range } from 'slate'
import { KeyboardEvent } from 'react'

import Hotkeys from '../utils/hotkeys'
import { IS_IOS } from '../utils/environment'
import { ReactEditor } from '.'

export default class ReactEditorEvents {
  /**
   * On before input.
   */

  onBeforeInput(this: ReactEditor, event: any) {
    // If the event is synthetic, it's React's polyfill of `beforeinput`
    // that isn't a true `beforeinput` event with meaningful information. It
    // only gets triggered for character insertions, so we can insert.
    if ('nativeEvent' in event) {
      event.preventDefault()
      this.insertText(event.data)
      return
    }

    // Otherwise, we can use the information in the `beforeinput` event to
    // figure out the exact change that will occur, and prevent it.
    const [targetRange] = event.getTargetRanges()

    if (!targetRange) {
      return
    }

    event.preventDefault()

    const range = this.toSlateRange(targetRange)

    if (!range) {
      return
    }

    switch (event.inputType) {
      case 'deleteByDrag':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward': {
        this.delete({ at: range })
        break
      }

      case 'deleteWordBackward': {
        this.delete({ at: range, unit: 'word', reverse: true })
        break
      }

      case 'deleteWordForward': {
        this.delete({ at: range, unit: 'word' })
        break
      }

      case 'deleteSoftLineBackward':
      case 'deleteHardLineBackward': {
        this.delete({ at: range, unit: 'line', reverse: true })
        break
      }

      case 'deleteSoftLineForward':
      case 'deleteHardLineForward': {
        this.delete({ at: range, unit: 'line' })
        break
      }

      case 'insertLineBreak':
      case 'insertParagraph': {
        this.splitNodes({ at: range })
        break
      }

      case 'insertFromYank':
      case 'insertReplacementText':
      case 'insertText': {
        // COMPAT: `data` should have the text for the `insertText` input type
        // and `dataTransfer` should have the text for the
        // `insertReplacementText` input type, but Safari uses `insertText` for
        // spell check replacements and sets `data` to `null`. (2018/08/09)
        const text =
          event.data == null
            ? event.dataTransfer.getData('text/plain')
            : event.data

        if (text != null) {
          this.insertText(text, { at: range })
        }

        break
      }
    }
  }

  /**
   * On input.
   */

  onInput(this: ReactEditor, event: any) {
    const domSelection = window.getSelection()

    if (!domSelection) {
      return
    }

    const selection = this.toSlateRange(domSelection)

    if (selection) {
      this.select(selection)
    } else {
      this.blur()
    }

    const { anchorNode } = domSelection
    this.reconcileDOMNode(anchorNode)
  }

  /**
   * On key down.
   */

  onKeyDown(this: ReactEditor, event: KeyboardEvent) {
    const { selection } = this.value

    if (!selection) {
      return
    }

    const [start] = Range.edges(selection)
    const voidMatch = this.getMatch(start, 'void')

    // COMPAT: In iOS, some of these hotkeys are handled in the
    // `onNativeBeforeInput` handler of the `<Content>` component in order
    // to preserve native autocorrect behavior, so don't handle them here.
    if (Hotkeys.isSplitBlock(event) && !IS_IOS) {
      if (voidMatch) {
        const [, voidPath] = voidMatch
        const next = this.getAfter(voidPath)

        if (next) {
          this.select(next)
        }
      } else {
        this.splitNodes()
      }
    }

    if (Hotkeys.isDeleteBackward(event) && !IS_IOS) {
      this.delete({ unit: 'character', reverse: true })
      return
    }

    if (Hotkeys.isDeleteForward(event) && !IS_IOS) {
      this.delete({ unit: 'character' })
      return
    }

    if (Hotkeys.isDeleteLineBackward(event)) {
      this.delete({ unit: 'line', reverse: true })
      return
    }

    if (Hotkeys.isDeleteLineForward(event)) {
      this.delete({ unit: 'line' })
      return
    }

    if (Hotkeys.isDeleteWordBackward(event)) {
      this.delete({ unit: 'word', reverse: true })
      return
    }

    if (Hotkeys.isDeleteWordForward(event)) {
      this.delete({ unit: 'word' })
      return
    }

    if (Hotkeys.isRedo(event)) {
      this.redo()
      return
    }

    if (Hotkeys.isUndo(event)) {
      this.undo()
      return
    }

    // COMPAT: Certain browsers don't handle the selection updates properly. In
    // Chrome, the selection isn't properly extended. And in Firefox, the
    // selection isn't properly collapsed. (2017/10/17)
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
    // adjacent to an inline is selected, we need to handle these hotkeys
    // manually because browsers won't know what to do.
    if (Hotkeys.isMoveBackward(event)) {
      event.preventDefault()

      if (Range.isCollapsed(selection)) {
        this.move({ reverse: true })
      } else {
        this.collapse({ edge: 'start' })
      }

      return
    }

    if (Hotkeys.isMoveForward(event)) {
      event.preventDefault()

      if (Range.isCollapsed(selection)) {
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
}
