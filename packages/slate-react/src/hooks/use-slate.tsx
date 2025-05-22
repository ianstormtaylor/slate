import { createContext, useContext, useReducer } from 'react'
import { Editor } from 'slate'
import { ReactEditor } from '../plugin/react-editor'
import { SlateSelectorContext, useSlateSelector } from './use-slate-selector'
import { useSlateStatic } from './use-slate-static'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

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
 * Get the current editor object and re-render whenever it changes
 */

export const useSlate = (): Editor => {
  const { addEventListener } = useContext(SlateSelectorContext)
  const [, forceRender] = useReducer(s => s + 1, 0)

  if (!addEventListener) {
    throw new Error(
      `The \`useSlate\` hook must be used inside the <Slate> component's context.`
    )
  }

  useIsomorphicLayoutEffect(
    () => addEventListener(forceRender),
    [addEventListener]
  )

  return useSlateStatic()
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
