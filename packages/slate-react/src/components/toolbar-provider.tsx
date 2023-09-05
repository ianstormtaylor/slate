import React from 'react'
import { Editor, Scrubber } from 'slate'
import { SlateContextValue } from '../hooks/use-slate'
import { ReactEditor } from '../plugin/react-editor'

import { Provider } from './provider'

export const ToolbarProvider = (props: {
  editor: ReactEditor
  children: React.ReactNode
}) => {
  const { editor, children } = props

  const [context, setContext] = React.useState<SlateContextValue>(() => {
    if (!Editor.isEditor(editor)) {
      throw new Error(
        `[Slate] editor is invalid! You passed: ${Scrubber.stringify(editor)}`
      )
    }
    return { v: 0, editor }
  })

  return (
    <Provider
      editor={editor}
      context={context}
      children={children}
      setContext={setContext}
    />
  )
}
