import { createContext, useContext } from 'react'
import { Editor } from 'slate'
import { ReactEditor } from '../plugin/react-editor'

/**
 * A React context for sharing the editor object, in a way that re-renders the
 * context whenever changes occur.
 */

export interface SlateContextValue {
  v: number
  editor: ReactEditor
}

export const SlateContext = createContext<{
  v: number
  editor: ReactEditor
} | null>(null)

/**
 * Get the current editor object from the React context.
 */

export const useSlate = (): Editor => {
  const context = useContext(SlateContext)

  if (!context) {
    throw new Error(
      `The \`useSlate\` hook must be used inside the <Slate> component's context.`
    )
  }

  const { editor } = context
  return editor
}

export const useSlateWithV = (): { editor: Editor; v: number } => {
  const context = useContext(SlateContext)

  if (!context) {
    throw new Error(
      `The \`useSlate\` hook must be used inside the <Slate> component's context.`
    )
  }

  return context
}
