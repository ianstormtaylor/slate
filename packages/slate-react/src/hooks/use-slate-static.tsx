import { createContext, useContext } from 'react'

import { ReactEditor } from '../plugin/react-editor'

/**
 * A React context for sharing the editor object.
 */

export const EditorContext = createContext<ReactEditor | null>(null)

/**
 * Get the current editor object from the React context.
 */

export const useSlateStatic = () => {
  const editor = useContext(EditorContext)

  if (!editor) {
    throw new Error(
      `The \`useSlateStatic\` hook must be used inside the <Slate> component's context.`
    )
  }

  return editor
}
