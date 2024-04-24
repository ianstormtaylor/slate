import { createContext, useContext } from 'react'

/**
 * A React context for sharing the `focused` state of the editor.
 */

export const FocusedContext = createContext(false)
FocusedContext.displayName = 'FocusedContext'

/**
 * Get the current `focused` state of the editor.
 */

export const useFocused = (): boolean => {
  return useContext(FocusedContext)
}
