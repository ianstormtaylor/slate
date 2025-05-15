import { createContext, useContext } from 'react'
import { Element } from 'slate'

export const ElementContext = createContext<Element | null>(null)

/**
 * Get the current element.
 */

export const useElement = (): Element => {
  const context = useContext(ElementContext)

  if (!context) {
    throw new Error(
      'The `useElement` hook must be used inside `renderElement`.'
    )
  }

  return context
}

/**
 * Get the current element, or return null if not inside `renderElement`.
 */
export const useElementIf = () => useContext(ElementContext)
