import { createContext, useContext } from 'react'
import { ReactEditor } from '..'

/**
 * A React context for sharing the `ReactEditor` class.
 */

export const EditorContext = createContext<ReactEditor | undefined>(undefined)

/**
 * Get the current `ReactEditor` class that the component lives under.
 */

export const useEditor = () => {
  const editor = useContext(EditorContext)

  if (!editor) {
    throw new Error(
      `The \`useEditor\` hook must be used inside the <Editor> context.`
    )
  }

  return editor
}
