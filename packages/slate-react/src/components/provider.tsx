import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Descendant } from 'slate'
import { FocusedContext } from '../hooks/use-focused'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { SlateContext, SlateContextValue } from '../hooks/use-slate'
import {
  useSelectorContext,
  SlateSelectorContext,
} from '../hooks/use-slate-selector'
import { EditorContext } from '../hooks/use-slate-static'
import { ReactEditor } from '../plugin/react-editor'
import { IS_REACT_VERSION_17_OR_ABOVE } from '../utils/environment'
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps'

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
export const Provider = (props: {
  editor: ReactEditor
  context: SlateContextValue
  children: React.ReactNode
  onChange?: (value: Descendant[]) => void
  setContext: React.Dispatch<SlateContextValue>
}) => {
  const { editor, context, children, onChange, setContext } = props
  const unmountRef = useRef(false)

  const {
    selectorContext,
    onChange: handleSelectorChange,
  } = useSelectorContext(editor)

  const onContextChange = useCallback(() => {
    if (onChange) {
      onChange(editor.children)
    }

    setContext(prevContext => ({
      v: prevContext.v + 1,
      editor,
    }))
    handleSelectorChange(editor)
  }, [editor, handleSelectorChange, onChange])

  useEffect(() => {
    const onChangesSet = EDITOR_TO_ON_CHANGE.get(editor) ?? new Set()

    onChangesSet.add(onContextChange)

    EDITOR_TO_ON_CHANGE.set(editor, onChangesSet)

    return () => {
      const onChangesSet = EDITOR_TO_ON_CHANGE.get(editor) ?? new Set()

      onChangesSet.delete(onContextChange)

      EDITOR_TO_ON_CHANGE.set(editor, onChangesSet)
      unmountRef.current = true
    }
  }, [editor, onContextChange])

  const [isFocused, setIsFocused] = useState(ReactEditor.isFocused(editor))

  useEffect(() => {
    setIsFocused(ReactEditor.isFocused(editor))
  }, [editor])

  useIsomorphicLayoutEffect(() => {
    const fn = () => setIsFocused(ReactEditor.isFocused(editor))
    if (IS_REACT_VERSION_17_OR_ABOVE) {
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
      <SlateContext.Provider value={context}>
        <EditorContext.Provider value={context.editor}>
          <FocusedContext.Provider value={isFocused}>
            {children}
          </FocusedContext.Provider>
        </EditorContext.Provider>
      </SlateContext.Provider>
    </SlateSelectorContext.Provider>
  )
}
