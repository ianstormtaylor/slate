import { createContext, useContext } from 'react'
import { Value } from 'slate'
import { ReactEditor } from '../plugin/react-editor'

/**
 * A React context for sharing the editor object, in a way that re-renders the
 * context whenever changes occur.
 */

export const SlateContext = createContext<[ReactEditor<Value>] | null>(null)

/**
 * Get the current editor object from the React context.
 */

export const useSlate = <V extends Value>(): ReactEditor<V> => {
  const context = useContext(SlateContext)

  if (!context) {
    throw new Error(
      `The \`useSlate\` hook must be used inside the <SlateProvider> component's context.`
    )
  }

  const [editor] = context
  return editor as ReactEditor<V>
}
