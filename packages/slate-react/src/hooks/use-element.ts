import { createContext, useContext } from 'react'
import { Element } from 'slate'

export const ElementContext = createContext<Element | null>(null)

/**
 * Get the current element object. Re-renders whenever the element or any of its descendants changes.
 * @group Hooks
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
 * The same as {@link useElement} but returns `null` instead of throwing an error when not inside an element.
 * @group Hooks
 */
export const useElementIf = () => useContext(ElementContext)
