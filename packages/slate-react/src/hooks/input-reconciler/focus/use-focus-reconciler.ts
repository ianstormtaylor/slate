import React, { useCallback, useEffect } from 'react'
import { Editor, Element, Path, Transforms } from 'slate'

import { ReactEditor } from '../../..'
import { isDOMElement, isDOMNode } from '../../../utils/dom'
import {
  isEventHandled,
  hasEditableTarget,
  hasTarget,
} from '../../../utils/helpers'
import { IS_FIREFOX } from '../../../utils/environment'
import { IS_FOCUSED } from '../../../utils/weak-maps'
import { ReconcilerArguments } from '../types'

interface Arguments extends ReconcilerArguments {}

export function useFocusReconciler({
  attributes,
  context,
  editor,
  nodeRef,
  readOnly,
}: Arguments) {
  const { autoFocus, onClick, onFocus, onBlur } = attributes

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const { selection } = context.current

      if (
        !readOnly &&
        !selection.isUpdating &&
        hasEditableTarget(editor, event.target) &&
        !isEventHandled(event, onFocus)
      ) {
        const el = ReactEditor.toDOMNode(editor, editor)
        const root = ReactEditor.findDocumentOrShadowRoot(editor)
        context.current.latestElement = root.activeElement ?? undefined

        // COMPAT: If the editor has nested editable elements, the focus
        // can go to them. In Firefox, this must be prevented because it
        // results in issues with keyboard navigation. (2017/03/30)
        if (IS_FIREFOX && event.target !== el) {
          el.focus()
          return
        }

        IS_FOCUSED.set(editor, true)
      }
    },
    [readOnly, onFocus]
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const { selection } = context.current

      if (
        readOnly ||
        selection.isUpdating ||
        !hasEditableTarget(editor, event.target) ||
        isEventHandled(event, onBlur)
      ) {
        return
      }

      // COMPAT: If the current `activeElement` is still the previous
      // one, this is due to the window being blurred when the tab
      // itself becomes unfocused, so we want to abort early to allow to
      // editor to stay focused when the tab becomes focused again.
      const { latestElement } = context.current
      const root = ReactEditor.findDocumentOrShadowRoot(editor)
      if (latestElement === root.activeElement) {
        return
      }

      const { relatedTarget } = event
      const el = ReactEditor.toDOMNode(editor, editor)

      // COMPAT: The event should be ignored if the focus is returning
      // to the editor from an embedded editable element (eg. an <input>
      // element inside a void node).
      if (relatedTarget === el) {
        return
      }

      // COMPAT: The event should be ignored if the focus is moving from
      // the editor to inside a void node's spacer element.
      if (
        isDOMElement(relatedTarget) &&
        relatedTarget.hasAttribute('data-slate-spacer')
      ) {
        return
      }

      // COMPAT: The event should be ignored if the focus is moving to a
      // non- editable section of an element that isn't a void node (eg.
      // a list item of the check list example).
      if (
        relatedTarget != null &&
        isDOMNode(relatedTarget) &&
        ReactEditor.hasDOMNode(editor, relatedTarget)
      ) {
        const node = ReactEditor.toSlateNode(editor, relatedTarget)

        if (Element.isElement(node) && !editor.isVoid(node)) {
          return
        }
      }

      IS_FOCUSED.delete(editor)
    },
    [readOnly, onBlur]
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        !readOnly &&
        hasTarget(editor, event.target) &&
        !isEventHandled(event, onClick) &&
        isDOMNode(event.target)
      ) {
        const node = ReactEditor.toSlateNode(editor, event.target)
        const path = ReactEditor.findPath(editor, node)
        const start = Editor.start(editor, path)
        const end = Editor.end(editor, path)

        const startVoid = Editor.void(editor, { at: start })
        const endVoid = Editor.void(editor, { at: end })

        if (startVoid && endVoid && Path.equals(startVoid[1], endVoid[1])) {
          const range = Editor.range(editor, start)
          Transforms.select(editor, range)
        }
      }
    },
    [readOnly, onClick]
  )

  // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
  // needs to be manually focused.
  useEffect(() => {
    if (nodeRef.current && autoFocus) {
      nodeRef.current.focus()
    }
  }, [autoFocus])

  return {
    handlers: {
      onBlur: handleBlur,
      onClick: handleClick,
      onFocus: handleFocus,
    },
  }
}
