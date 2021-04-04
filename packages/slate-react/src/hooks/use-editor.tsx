import { useContext } from 'react'

import { EditorContext } from './use-editor-static'

/**
 * Get the current editor object from the React context.
 * @deprecated Use useEditorStatic instead.
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
