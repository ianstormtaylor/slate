import { RefObject, useCallback, useMemo, useRef } from 'react'
import { Editor, Range, Transforms } from 'slate'

import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useSlate } from '../../hooks/use-slate'
import { ReactEditor } from '../../plugin/react-editor'
import { DOMStaticRange } from '../../utils/dom'
import {
  HAS_BEFORE_INPUT_SUPPORT,
  IS_FIREFOX,
  IS_SAFARI,
} from '../../utils/environment'
import { hasEditableTarget, isEventHandled } from '../../utils/helpers'

import { InputStrategy } from '../types'

export const useBeforeInputStrategy: InputStrategy = ({
  nodeRef,
  handlers,
  readOnly,
}) => {
  const editor = useSlate()
  const isComposingRef = useRef(false)

  // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211
  const onDOMBeforeInput = useCallback(
    (
      event: Event & {
        data: string | null
        dataTransfer: DataTransfer | null
        getTargetRanges(): DOMStaticRange[]
        inputType: string
        isComposing: boolean
      }
    ) => {
      if (
        !readOnly &&
        hasEditableTarget(editor, event.target) &&
        !isDOMEventHandled(event, handlers.onDOMBeforeInput)
      ) {
        const { selection } = editor
        const { inputType: type } = event
        const data = event.dataTransfer || event.data || undefined

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
          const [targetRange] = event.getTargetRanges()

          if (targetRange) {
            const range = ReactEditor.toSlateRange(editor, targetRange)

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
          Editor.deleteFragment(editor)
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
            if (data instanceof DataTransfer) {
              ReactEditor.insertData(editor, data)
            } else if (typeof data === 'string') {
              Editor.insertText(editor, data)
            }

            break
          }
        }
      }
    },
    [readOnly, handlers.onDOMBeforeInput]
  )

  // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)
  // https://github.com/facebook/react/issues/11211
  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current && HAS_BEFORE_INPUT_SUPPORT) {
      // @ts-ignore The `beforeinput` event isn't recognized.
      nodeRef.current.addEventListener('beforeinput', onDOMBeforeInput)
    }

    return () => {
      if (nodeRef.current && HAS_BEFORE_INPUT_SUPPORT) {
        // @ts-ignore The `beforeinput` event isn't recognized.
        nodeRef.current.removeEventListener('beforeinput', onDOMBeforeInput)
      }
    }
  }, [onDOMBeforeInput])

  const syntheticBeforeInputHandler = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      // COMPAT: Certain browsers don't support the `beforeinput` event, so we
      // fall back to React's leaky polyfill instead just for it. It
      // only works for the `insertText` input type.
      if (
        !HAS_BEFORE_INPUT_SUPPORT &&
        !readOnly &&
        !isEventHandled(event, handlers.onBeforeInput) &&
        hasEditableTarget(editor, event.target)
      ) {
        event.preventDefault()
        const text = (event as any).data as string
        Editor.insertText(editor, text)
      }
    },
    [readOnly, handlers.onBeforeInput]
  )

  const syntheticCompositionStartHandler = useCallback(
    (event: React.CompositionEvent<HTMLDivElement>) => {
      if (
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, handlers.onCompositionStart)
      ) {
        isComposingRef.current = true
      }
    },
    [handlers.onCompositionStart]
  )

  const syntheticCompositionEndHandler = useCallback(
    (event: React.CompositionEvent<HTMLDivElement>) => {
      if (
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, handlers.onCompositionEnd)
      ) {
        isComposingRef.current = false

        // COMPAT: In Chrome, `beforeinput` events for compositions
        // aren't correct and never fire the "insertFromComposition"
        // type that we need. So instead, insert whenever a composition
        // ends since it will already have been committed to the DOM.
        if (!IS_SAFARI && !IS_FIREFOX && event.data) {
          Editor.insertText(editor, event.data)
        }
      }
    },
    [handlers.onCompositionEnd]
  )

  const syntheticHandlers = useMemo(
    () => ({
      onBeforeInput: syntheticBeforeInputHandler,
      onCompositionEnd: syntheticCompositionEndHandler,
      onCompositionStart: syntheticCompositionStartHandler,
    }),
    [
      syntheticBeforeInputHandler,
      syntheticCompositionStartHandler,
      syntheticCompositionEndHandler,
    ]
  )

  return useMemo(
    () => ({
      attributes: {
        ...syntheticHandlers,
      },
      isComposing: isComposingRef,
    }),
    [syntheticHandlers]
  )
}

/**
 * Check if a DOM event is overrided by a handler.
 */

const isDOMEventHandled = (event: Event, handler?: (event: Event) => void) => {
  if (!handler) {
    return false
  }

  handler(event)
  return event.defaultPrevented
}
