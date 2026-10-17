import { createContext, useContext } from 'react'
import { ReactEditor } from '../plugin/react-editor'

export const EDITOR_TO_COMPOSING = new WeakMap<ReactEditor, boolean>()

/**
 * A React context for sharing the `composing` state of the editor.
 */

export const ComposingContext = createContext(false)

/**
 * Get the current `composing` state of the editor.
 */

export const useComposing = (): boolean => {
  return useContext(ComposingContext)
}
