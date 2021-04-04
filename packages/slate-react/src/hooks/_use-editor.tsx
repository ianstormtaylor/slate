import { useContext } from 'react'

import { EditorContext } from './use-editor-static'

/**
 * Get the current editor object from the React context.
 * @deprecated Use useEditorStatic instead.
 */

export const _useEditor = () => {
  const editor = useContext(EditorContext)

  if (!editor) {
    throw new Error(
      `The \`_useEditor\` hook must be used inside the <Slate> component's context.`
    )
  }

  return editor
}
