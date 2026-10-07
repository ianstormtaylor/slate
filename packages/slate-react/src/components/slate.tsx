import React, { useCallback, useEffect, useState } from 'react'
import { Descendant, Editor, Node, Operation, Scrubber, Selection } from 'slate'
import { EDITOR_TO_ON_CHANGE } from 'slate-dom'
import { FocusedContext } from '../hooks/use-focused'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import {
  useSelectorContext,
  SlateSelectorContext,
} from '../hooks/use-slate-selector'
import { EditorContext } from '../hooks/use-slate-static'
import { ReactEditor } from '../plugin/react-editor'
import { REACT_MAJOR_VERSION } from '../utils/environment'
import { Editable } from './editable'

/** @inline */
interface SlateProps {
  /** An instance of `ReactEditor`. */
  editor: ReactEditor
  /** The initial value of the Editor. */
  initialValue: Descendant[]
  /** The `children` which must contain an `Editable` component. */
  children: React.ReactNode
  /** An optional callback function which you can use to be notified of changes in the editor's selection and/or value. */
  onChange?: (value: Descendant[]) => void
  /** An optional callback function which you can use to be notified of changes in the editor's selection. */
  onSelectionChange?: (selection: Selection) => void
  /** An optional callback function which you can use to be notified of changes in the editor's value. */
  onValueChange?: (value: Descendant[]) => void
}

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 *
 * The `Slate` component must include somewhere in its `children` the {@link Editable} component.
 * @group Components
 */
export const Slate = (props: SlateProps) => {
  const {
    editor,
    children,
    onChange,
    onSelectionChange,
    onValueChange,
    initialValue,
    ...rest
  } = props

  // Run once on first mount, but before `useEffect` or render
  React.useState(() => {
    if (!Node.isNodeList(initialValue)) {
      throw new Error(
        `[Slate] initialValue is invalid! Expected a list of elements but got: ${Scrubber.stringify(
          initialValue
        )}`
      )
    }

    if (!Editor.isEditor(editor)) {
      throw new Error(
        `[Slate] editor is invalid! You passed: ${Scrubber.stringify(editor)}`
      )
    }

    editor.children = initialValue
    Object.assign(editor, rest)
  })

  const { selectorContext, onChange: handleSelectorChange } =
    useSelectorContext()

  const onContextChange = useCallback(() => {
    if (onChange) {
      onChange(editor.children)
    }
    if (
      onSelectionChange &&
      editor.operations.find(op => op.type === 'set_selection')
    ) {
      onSelectionChange(editor.selection)
    }
    if (
      onValueChange &&
      editor.operations.find(op => op.type !== 'set_selection')
    ) {
      onValueChange(editor.children)
    }

    handleSelectorChange()
  }, [editor, handleSelectorChange, onChange, onSelectionChange, onValueChange])

  useEffect(() => {
    EDITOR_TO_ON_CHANGE.set(editor, onContextChange)

    return () => {
      EDITOR_TO_ON_CHANGE.set(editor, () => {})
    }
  }, [editor, onContextChange])

  const [isFocused, setIsFocused] = useState(ReactEditor.isFocused(editor))

  useEffect(() => {
    setIsFocused(ReactEditor.isFocused(editor))
  }, [editor])

  useIsomorphicLayoutEffect(() => {
    const fn = () => setIsFocused(ReactEditor.isFocused(editor))
    if (REACT_MAJOR_VERSION >= 17) {
      // In React >= 17 onFocus and onBlur listen to the focusin and focusout events during the bubbling phase.
      // Therefore in order for <Editable />'s handlers to run first, which is necessary for ReactEditor.isFocused(editor)
      // to return the correct value, we have to listen to the focusin and focusout events without useCapture here.
      document.addEventListener('focusin', fn)
      document.addEventListener('focusout', fn)
      return () => {
        document.removeEventListener('focusin', fn)
        document.removeEventListener('focusout', fn)
      }
    } else {
      document.addEventListener('focus', fn, true)
      document.addEventListener('blur', fn, true)
      return () => {
        document.removeEventListener('focus', fn, true)
        document.removeEventListener('blur', fn, true)
      }
    }
  }, [])

  return (
    <SlateSelectorContext.Provider value={selectorContext}>
      <EditorContext.Provider value={editor}>
        <FocusedContext.Provider value={isFocused}>
          {children}
        </FocusedContext.Provider>
      </EditorContext.Provider>
    </SlateSelectorContext.Provider>
  )
}
