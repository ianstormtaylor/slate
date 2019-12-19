import React, { useMemo, useState, useCallback } from 'react'
import { Node } from 'slate'

import { ReactEditor } from '../plugin/react-editor'
import { FocusedContext } from '../hooks/use-focused'
import { EditorContext } from '../hooks/use-editor'
import { SlateContext } from '../hooks/use-slate'
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps'

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */

export const Slate = (props: {
  editor: ReactEditor
  value: Node[]
  children: React.ReactNode
  onChange: (value: Node[]) => void
  [key: string]: any
}) => {
  const { editor, children, onChange, value, ...rest } = props
  const [key, setKey] = useState(0)
  const context: [ReactEditor] = useMemo(() => {
    editor.children = value
    Object.assign(editor, rest)
    return [editor]
  }, [key, value, ...Object.values(rest)])

  const onContextChange = useCallback(() => {
    onChange(editor.children)
    setKey(key + 1)
  }, [key, onChange])

  EDITOR_TO_ON_CHANGE.set(editor, onContextChange)

  return (
    <SlateContext.Provider value={context}>
      <EditorContext.Provider value={editor}>
        <FocusedContext.Provider value={ReactEditor.isFocused(editor)}>
          {children}
        </FocusedContext.Provider>
      </EditorContext.Provider>
    </SlateContext.Provider>
  )
}
