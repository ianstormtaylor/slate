import { parsePlaintext } from 'slate-parse-plaintext'
import { Range, Node } from 'slate'
import {
  SyntheticEvent,
  FocusEvent,
  CompositionEvent,
  ClipboardEvent,
  DragEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react'

import Hotkeys from '../utils/hotkeys'
import cloneFragment from '../utils/clone-fragment'
import { IS_CLICKING, IS_DRAGGING } from '../utils/weak-maps'
import { IS_IOS, IS_IE, IS_EDGE } from '../utils/environment'
import { ReactEditor } from '.'
import { encode } from '../utils/base-64'
import { isNativeNode } from '../utils/dom'

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
   * On blur.
   */

  onBlur(this: ReactEditor, event: FocusEvent) {
    this.blur()
  }

  /**
   * On click.
   */

  onClick(this: ReactEditor, event: MouseEvent) {
    if (!this.isReadOnly() && isNativeNode(event.target)) {
      const node = this.toSlateNode(event.target)
      const path = this.findPath(node)

      // COMPAT: In Chrome & Safari, selections that are at the zero offset
      // of an inline node will be automatically replaced to be at the last
      // offset of a previous inline node, which screws us up, so we always
      // want to set it to the end of the node. (2016/11/29)
      if (this.getMatch(path, 'void')) {
        this.select(path)
        this.focus()
      }
    }
  }

  /**
   * On composition end.
   */

  onCompositionEnd(this: ReactEditor, event: CompositionEvent) {}

  /**
   * On composition start.
   */

  onCompositionStart(this: ReactEditor, event: CompositionEvent) {}

  /**
   * On copy.
   */

  onCopy(this: ReactEditor, event: ClipboardEvent) {
    cloneFragment(event.nativeEvent, this)
  }

  /**
   * On cut.
   */

  onCut(this: ReactEditor, event: ClipboardEvent) {
    // Once the fake cut content has successfully been added to the
    // clipboard, delete the content in the current selection.
    cloneFragment(event.nativeEvent, this, () => {
      if (this.isExpanded()) {
        this.delete()
      }
    })
  }

  /**
   * On drag end.
   */

  onDragEnd(this: ReactEditor, event: DragEvent) {
    IS_DRAGGING.delete(this)
  }

  /**
   * On drag enter.
   */

  onDragEnter(this: ReactEditor, event: DragEvent) {}

  /**
   * On drag exit.
   */

  onDragExit(this: ReactEditor, event: DragEvent) {}

  /**
   * On drag leave.
   */

  onDragLeave(this: ReactEditor, event: DragEvent) {}

  /**
   * On drag over.
   */

  onDragOver(this: ReactEditor, event: DragEvent) {}

  /**
   * On drag start.
   */

  onDragStart(this: ReactEditor, event: DragEvent) {
    if (!isNativeNode(event.target)) {
      return
    }

    IS_DRAGGING.set(this, true)

    const node = this.toSlateNode(event.target)
    const path = this.findPath(node)
    const voidMatch = this.getMatch(path, 'void')

    // If a void node is being dragged and is not currently selected, select
    // it (necessary for local drags).
    if (voidMatch) {
      const range = this.getRange(path)
      this.select(range)
    }

    const { selection } = this.value

    if (selection) {
      const fragment = Node.fragment(this.value, selection)
      const encoded = encode(fragment)
      this.setEventTransfer(event, 'fragment', encoded)
    }
  }

  /**
   * On drop.
   */

  onDrop(this: ReactEditor, event: DragEvent) {}

  /**
   * On focus.
   */

  onFocus(this: ReactEditor, event: FocusEvent) {
    // COMPAT: If the focus event is a mouse-based one, it will be shortly
    // followed by a `selectionchange`, so we need to deselect here to prevent
    // the old selection from being set by the `updateSelection` of `<Content>`,
    // preventing the `selectionchange` from firing. (2018/11/07)
    if (IS_CLICKING.get(this) && !IS_IE && !IS_EDGE) {
      this.deselect()
      this.focus()
    } else {
      this.focus()
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

  /**
   * On key up.
   */

  onKeyUp(this: ReactEditor, event: KeyboardEvent) {}

  /**
   * On mouse down.
   */

  onMouseDown(this: ReactEditor, event: MouseEvent) {
    IS_CLICKING.set(this, true)
  }

  /**
   * On mouse up.
   */

  onMouseUp(this: ReactEditor, event: MouseEvent) {
    IS_CLICKING.delete(this)
  }

  /**
   * On paste.
   */

  onPaste(this: ReactEditor, event: ClipboardEvent) {
    const { value } = this
    const transfer = this.getEventTransfer(event)
    const { type, fragment, text } = transfer

    if (type === 'fragment' && fragment) {
      this.insertFragment(fragment)
    }

    if (type === 'text' || type === 'html') {
      if (!text) {
        return
      }

      const { selection } = value

      if (selection == null) {
        return
      }

      const [start] = Range.edges(selection)
      const startBlock = this.getMatch(start, 'block')
      const parsed = parsePlaintext(text, {
        elementProps: startBlock ? startBlock[0] : {},
      })

      this.insertFragment({ nodes: parsed.nodes })
    }
  }

  /**
   * On select.
   */

  onSelect(this: ReactEditor, event: any) {
    const { selection } = this.value
    const domSelection = window.getSelection()

    if (domSelection) {
      const range = this.toSlateRange(domSelection)!

      if (!selection || !Range.equals(range, selection)) {
        this.select(range)
        this.focus()
      }
    } else {
      this.blur()
    }

    // COMPAT: reset the mouse down state here in case a `mouseup` event
    // happens outside the editor. This is needed for `onFocus` handling.
    IS_CLICKING.delete(this)
  }
}
