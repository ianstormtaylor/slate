import React, { useMemo } from 'react'
import { Editor, Node, Range } from 'slate'

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
  editor: Editor
  value: Node[]
  selection: Range | null
  children: React.ReactNode
  onChange: (children: Node[], selection: Range | null) => void
  [key: string]: any
}) => {
  const { editor, children, onChange, value, selection, ...rest } = props
  const context: [Editor] = useMemo(() => {
    editor.children = value
    editor.selection = selection
    return [editor]
  }, [value, selection, ...Object.values(rest)])

  EDITOR_TO_ON_CHANGE.set(editor, onChange)

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
