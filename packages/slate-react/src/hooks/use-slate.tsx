import { Editor } from 'slate'
import { createContext, useContext } from 'react'

/**
 * A React context for sharing the `Editor` class, in a way that re-renders the
 * context whenever changes occur.
 */

export const SlateContext = createContext<[Editor] | null>(null)

/**
 * Get the current `Editor` class that the component lives under.
 */

export const useSlate = () => {
  const context = useContext(SlateContext)

  if (!context) {
    throw new Error(
      `The \`useSlate\` hook must be used inside the <SlateProvider> component's context.`
    )
  }

  const [editor] = context
  return editor
}
