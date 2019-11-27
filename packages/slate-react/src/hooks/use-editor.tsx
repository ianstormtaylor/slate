import { Editor } from 'slate'
import { createContext, useContext } from 'react'

/**
 * A React context for sharing the `Editor` class.
 */

export const EditorContext = createContext<Editor | null>(null)

/**
 * Get the current `Editor` class that the component lives under.
 */

export const useEditor = () => {
  const editor = useContext(EditorContext)

  if (!editor) {
    throw new Error(
      `The \`useEditor\` hook must be used inside the <Slate> component's context.`
    )
  }

  return editor
}
