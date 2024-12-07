import { createContext, useContext } from 'react'
import { DecoratedRange, NodeEntry } from 'slate'

/**
 * A React context for sharing the `decorate` prop of the editable.
 */

export const DecorateContext = createContext<
  (entry: NodeEntry) => DecoratedRange[]
>(() => [])

/**
 * Get the current `decorate` prop of the editable.
 */

export const useDecorate = (): ((entry: NodeEntry) => DecoratedRange[]) => {
  return useContext(DecorateContext)
}
