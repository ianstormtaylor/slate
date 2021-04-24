import { useCallback } from 'react'
import { Editor, Node, Range, Transforms } from 'slate'

import { ReactEditor } from '../../..'
import { IS_SAFARI, HAS_BEFORE_INPUT_SUPPORT } from '../../../utils/environment'
import { isEventHandled, hasTarget } from '../../../utils/helpers'
import { ReconcilerArguments } from '../types'

interface Arguments extends ReconcilerArguments {}

export function useDragAndDropReconciler({
  attributes,
  editor,
  readOnly,
}: Arguments) {
  const { onDragStart, onDragOver, onDrop } = attributes
  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (
        hasTarget(editor, event.target) &&
        !isEventHandled(event, onDragStart)
      ) {
        const node = ReactEditor.toSlateNode(editor, event.target)
        const path = ReactEditor.findPath(editor, node)
        const voidMatch = Editor.void(editor, { at: path })

        // If starting a drag on a void node, make sure it is selected
        // so that it shows up in the selection's fragment.
        if (voidMatch) {
          const range = Editor.range(editor, path)
          Transforms.select(editor, range)
        }

        ReactEditor.setFragmentData(editor, event.dataTransfer)
      }
    },
    [onDragStart]
  )

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (
        hasTarget(editor, event.target) &&
        !isEventHandled(event, onDragOver)
      ) {
        // Only when the target is void, call `preventDefault` to signal
        // that drops are allowed. Editable content is droppable by
        // default, and calling `preventDefault` hides the cursor.
        const node = ReactEditor.toSlateNode(editor, event.target)

        if (Editor.isVoid(editor, node)) {
          event.preventDefault()
        }
      }
    },
    [onDragOver]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (
        hasTarget(editor, event.target) &&
        !readOnly &&
        !isEventHandled(event, onDrop)
      ) {
        // COMPAT: Certain browsers don't fire `beforeinput` events at all, and
        // Chromium browsers don't properly fire them for files being
        // dropped into a `contenteditable`. (2019/11/26)
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1028668
        if (
          !HAS_BEFORE_INPUT_SUPPORT ||
          (!IS_SAFARI && event.dataTransfer.files.length > 0)
        ) {
          event.preventDefault()
          const range = ReactEditor.findEventRange(editor, event)
          const data = event.dataTransfer
          Transforms.select(editor, range)
          ReactEditor.insertData(editor, data)
        }
      }
    },
    [readOnly, onDrop]
  )

  return {
    handlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  }
}
