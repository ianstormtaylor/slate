import { useContext } from 'react'
import warning from 'tiny-warning'

import { EditorContext } from './use-slate-static'

/**
 * Get the current editor object from the React context.
 *
 * @deprecated Use `useSlateStatic` instead.
 */

export const useEditor = () => {
  warning(
    true,
    'slate@0.60 - The `useEditor` hook has been renamed to `useSlateStatic`.'
  )

  const editor = useContext(EditorContext)

  if (!editor) {
    throw new Error(
      `The \`useEditor\` hook must be used inside the <Slate> component's context.`
    )
  }

  return editor
}
