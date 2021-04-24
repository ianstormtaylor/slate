import { useCallback } from 'react'
import { Editor, Node, Range, Transforms } from 'slate'

import { ReactEditor } from '../../..'
import { isPlainTextOnlyPaste } from '../../../utils/dom'
import { HAS_BEFORE_INPUT_SUPPORT } from '../../../utils/environment'
import { isEventHandled, hasEditableTarget } from '../../../utils/helpers'
import { ReconcilerArguments } from '../types'

interface Arguments extends ReconcilerArguments {}

export function useClipboardReconciler({
  attributes,
  editor,
  readOnly,
}: Arguments) {
  const { onCopy, onCut, onPaste } = attributes

  const handleCopy = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onCopy)
      ) {
        event.preventDefault()
        ReactEditor.setFragmentData(editor, event.clipboardData)
      }
    },
    [onCopy]
  )

  const handleCut = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (
        !readOnly &&
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onCut)
      ) {
        event.preventDefault()
        ReactEditor.setFragmentData(editor, event.clipboardData)
        const { selection } = editor

        if (selection) {
          if (Range.isExpanded(selection)) {
            Editor.deleteFragment(editor)
          } else {
            const node = Node.parent(editor, selection.anchor.path)
            if (Editor.isVoid(editor, node)) {
              Transforms.delete(editor)
            }
          }
        }
      }
    },
    [readOnly, onCut]
  )

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (
        !readOnly &&
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onPaste)
      ) {
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to React's `onPaste` here instead.
        // COMPAT: Firefox, Chrome and Safari don't emit `beforeinput` events
        // when "paste without formatting" is used, so fallback. (2020/02/20)
        if (
          !HAS_BEFORE_INPUT_SUPPORT ||
          isPlainTextOnlyPaste(event.nativeEvent)
        ) {
          event.preventDefault()
          ReactEditor.insertData(editor, event.clipboardData)
        }
      }
    },
    [readOnly, onPaste]
  )

  return {
    handlers: {
      onCopy: handleCopy,
      onCut: handleCut,
      onPaste: handlePaste,
    },
  }
}
