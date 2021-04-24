import { useCallback } from 'react'
import { Editor, Node, Range, Transforms } from 'slate'
import { HistoryEditor } from 'slate-history'
import getDirection from 'direction'

import { ReactEditor } from '../../../..'
import { useIsomorphicLayoutEffect } from '../../../use-isomorphic-layout-effect'
import {
  HAS_BEFORE_INPUT_SUPPORT,
  IS_SAFARI,
  IS_FIREFOX,
} from '../../../../utils/environment'
import {
  isEventHandled,
  isDOMEventHandled,
  hasEditableTarget,
} from '../../../../utils/helpers'
import Hotkeys from '../../../../utils/hotkeys'
import { ReconcilerArguments } from '../../types'

interface Arguments extends ReconcilerArguments {}

export function useBeforeInputReconciler({
  attributes,
  context,
  editor,
  nodeRef,
  readOnly,
}: Arguments) {
  const {
    onBeforeInput,
    onCompositionEnd,
    onCompositionStart,
    onCompositionUpdate,
    onDOMBeforeInput,
    onKeyDown,
  } = attributes

  const handleBeforeInput = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      // COMPAT: Certain browsers don't support the `beforeinput` event, so we
      // fall back to React's leaky polyfill instead just for it. It
      // only works for the `insertText` input type.
      if (
        !HAS_BEFORE_INPUT_SUPPORT &&
        !readOnly &&
        !isEventHandled(event, onBeforeInput) &&
        hasEditableTarget(editor, event.target)
      ) {
        event.preventDefault()

        const {
          composition: { isComposing },
        } = context.current

        if (!isComposing) {
          const text = (event as any).data as string
          Editor.insertText(editor, text)
        }
      }
    },
    [readOnly]
  )

  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent<HTMLDivElement>) => {
      if (
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onCompositionEnd)
      ) {
        context.current.composition.isComposing = false

        // COMPAT: In Chrome, `beforeinput` events for compositions
        // aren't correct and never fire the "insertFromComposition"
        // type that we need. So instead, insert whenever a composition
        // ends since it will already have been committed to the DOM.
        if (!IS_SAFARI && !IS_FIREFOX && event.data) {
          Editor.insertText(editor, event.data)
        }
      }
    },
    [onCompositionEnd]
  )

  const handleCompositionUpdate = useCallback(
    (event: React.CompositionEvent<HTMLDivElement>) => {
      if (
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onCompositionUpdate)
      ) {
        context.current.composition.isComposing = true
      }
    },
    [onCompositionUpdate]
  )

  const handleCompositionStart = useCallback(
    (event: React.CompositionEvent<HTMLDivElement>) => {
      if (
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onCompositionStart)
      ) {
        const { selection } = editor
        if (selection && Range.isExpanded(selection)) {
          Editor.deleteFragment(editor)
        }
      }
    },
    [onCompositionStart]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        !readOnly &&
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onKeyDown)
      ) {
        const { nativeEvent } = event
        const { selection } = editor

        const element =
          editor.children[selection !== null ? selection.focus.path[0] : 0]
        const isRTL = getDirection(Node.string(element)) === 'rtl'

        // COMPAT: Since we prevent the default behavior on
        // `beforeinput` events, the browser doesn't think there's ever
        // any history stack to undo or redo, so we have to manage these
        // hotkeys ourselves. (2019/11/06)
        if (Hotkeys.isRedo(nativeEvent)) {
          event.preventDefault()

          if (HistoryEditor.isHistoryEditor(editor)) {
            editor.redo()
          }

          return
        }

        if (Hotkeys.isUndo(nativeEvent)) {
          event.preventDefault()

          if (HistoryEditor.isHistoryEditor(editor)) {
            editor.undo()
          }

          return
        }

        // COMPAT: Certain browsers don't handle the selection updates
        // properly. In Chrome, the selection isn't properly extended.
        // And in Firefox, the selection isn't properly collapsed.
        // (2017/10/17)
        if (Hotkeys.isMoveLineBackward(nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, { unit: 'line', reverse: true })
          return
        }

        if (Hotkeys.isMoveLineForward(nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, { unit: 'line' })
          return
        }

        if (Hotkeys.isExtendLineBackward(nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, {
            unit: 'line',
            edge: 'focus',
            reverse: true,
          })
          return
        }

        if (Hotkeys.isExtendLineForward(nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, { unit: 'line', edge: 'focus' })
          return
        }

        // COMPAT: If a void node is selected, or a zero-width text node
        // adjacent to an inline is selected, we need to handle these
        // hotkeys manually because browsers won't be able to skip over
        // the void node with the zero-width space not being an empty
        // string.
        if (Hotkeys.isMoveBackward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isCollapsed(selection)) {
            Transforms.move(editor, { reverse: !isRTL })
          } else {
            Transforms.collapse(editor, { edge: 'start' })
          }

          return
        }

        if (Hotkeys.isMoveForward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isCollapsed(selection)) {
            Transforms.move(editor, { reverse: isRTL })
          } else {
            Transforms.collapse(editor, { edge: 'end' })
          }

          return
        }

        if (Hotkeys.isMoveWordBackward(nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, { unit: 'word', reverse: !isRTL })
          return
        }

        if (Hotkeys.isMoveWordForward(nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, { unit: 'word', reverse: isRTL })
          return
        }

        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to guessing at the input intention for hotkeys.
        // COMPAT: In iOS, some of these hotkeys are handled in the
        if (!HAS_BEFORE_INPUT_SUPPORT) {
          // We don't have a core behavior for these, but they change the
          // DOM if we don't prevent them, so we have to.
          if (
            Hotkeys.isBold(nativeEvent) ||
            Hotkeys.isItalic(nativeEvent) ||
            Hotkeys.isTransposeCharacter(nativeEvent)
          ) {
            event.preventDefault()
            return
          }

          if (Hotkeys.isSplitBlock(nativeEvent)) {
            event.preventDefault()
            Editor.insertBreak(editor)
            return
          }

          if (Hotkeys.isDeleteBackward(nativeEvent)) {
            event.preventDefault()

            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, { direction: 'backward' })
            } else {
              Editor.deleteBackward(editor)
            }

            return
          }

          if (Hotkeys.isDeleteForward(nativeEvent)) {
            event.preventDefault()

            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, { direction: 'forward' })
            } else {
              Editor.deleteForward(editor)
            }

            return
          }

          if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
            event.preventDefault()

            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, { direction: 'backward' })
            } else {
              Editor.deleteBackward(editor, { unit: 'line' })
            }

            return
          }

          if (Hotkeys.isDeleteLineForward(nativeEvent)) {
            event.preventDefault()

            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, { direction: 'forward' })
            } else {
              Editor.deleteForward(editor, { unit: 'line' })
            }

            return
          }

          if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
            event.preventDefault()

            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, { direction: 'backward' })
            } else {
              Editor.deleteBackward(editor, { unit: 'word' })
            }

            return
          }

          if (Hotkeys.isDeleteWordForward(nativeEvent)) {
            event.preventDefault()

            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, { direction: 'forward' })
            } else {
              Editor.deleteForward(editor, { unit: 'word' })
            }

            return
          }
        }
      }
    },
    [readOnly, onKeyDown]
  )

  // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211
  const handleDOMBeforeInput = useCallback(
    (event: InputEvent) => {
      if (
        !readOnly &&
        hasEditableTarget(editor, event.target) &&
        !isDOMEventHandled(event, onDOMBeforeInput)
      ) {
        const { selection } = editor
        const { inputType: type } = event
        const data = (event as any).dataTransfer || event.data || undefined

        // These two types occur while a user is composing text and can't be
        // cancelled. Let them through and wait for the composition to end.
        if (
          type === 'insertCompositionText' ||
          type === 'deleteCompositionText'
        ) {
          return
        }

        event.preventDefault()

        // COMPAT: For the deleting forward/backward input types we don't want
        // to change the selection because it is the range that will be deleted,
        // and those commands determine that for themselves.
        if (!type.startsWith('delete') || type.startsWith('deleteBy')) {
          const [targetRange] = (event as any).getTargetRanges()

          if (targetRange) {
            const range = ReactEditor.toSlateRange(editor, targetRange, {
              exactMatch: false,
            })

            if (!selection || !Range.equals(selection, range)) {
              Transforms.select(editor, range)
            }
          }
        }

        // COMPAT: If the selection is expanded, even if the command seems like
        // a delete forward/backward command it should delete the selection.
        if (
          selection &&
          Range.isExpanded(selection) &&
          type.startsWith('delete')
        ) {
          const direction = type.endsWith('Backward') ? 'backward' : 'forward'
          Editor.deleteFragment(editor, { direction })
          return
        }

        switch (type) {
          case 'deleteByComposition':
          case 'deleteByCut':
          case 'deleteByDrag': {
            Editor.deleteFragment(editor)
            break
          }

          case 'deleteContent':
          case 'deleteContentForward': {
            Editor.deleteForward(editor)
            break
          }

          case 'deleteContentBackward': {
            Editor.deleteBackward(editor)
            break
          }

          case 'deleteEntireSoftLine': {
            Editor.deleteBackward(editor, { unit: 'line' })
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineBackward': {
            Editor.deleteBackward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineBackward': {
            Editor.deleteBackward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineForward': {
            Editor.deleteForward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineForward': {
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteWordBackward': {
            Editor.deleteBackward(editor, { unit: 'word' })
            break
          }

          case 'deleteWordForward': {
            Editor.deleteForward(editor, { unit: 'word' })
            break
          }

          case 'insertLineBreak':
          case 'insertParagraph': {
            Editor.insertBreak(editor)
            break
          }

          case 'insertFromComposition':
          case 'insertFromDrop':
          case 'insertFromPaste':
          case 'insertFromYank':
          case 'insertReplacementText':
          case 'insertText': {
            if (type === 'insertFromComposition') {
              // COMPAT: in Safari, `compositionend` is dispatched after the
              // `beforeinput` for "insertFromComposition". But if we wait for it
              // then we will abort because we're still composing and the selection
              // won't be updated properly.
              // https://www.w3.org/TR/input-events-2/
              context.current.composition.isComposing = false
            }

            const window = ReactEditor.getWindow(editor)
            if (data instanceof window.DataTransfer) {
              ReactEditor.insertData(editor, data as DataTransfer)
            } else if (typeof data === 'string') {
              Editor.insertText(editor, data)
            }

            break
          }
        }
      }
    },
    [readOnly, onDOMBeforeInput]
  )

  // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)
  // https://github.com/facebook/react/issues/11211
  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current && HAS_BEFORE_INPUT_SUPPORT) {
      // @ts-ignore The `beforeinput` event isn't recognized.
      nodeRef.current.addEventListener('beforeinput', handleDOMBeforeInput)
    }

    return () => {
      if (nodeRef.current && HAS_BEFORE_INPUT_SUPPORT) {
        // @ts-ignore The `beforeinput` event isn't recognized.
        ref.current.removeEventListener('beforeinput', handleDOMBeforeInput)
      }
    }
  }, [handleDOMBeforeInput])

  return {
    handlers: {
      onBeforeInput: handleBeforeInput,
      onCompositionStart: handleCompositionStart,
      onCompositionUpdate: handleCompositionUpdate,
      onCompositionEnd: handleCompositionEnd,
      onKeyDown: handleKeyDown,
    },
  }
}
