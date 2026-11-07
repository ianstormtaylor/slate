import { createContext, useContext } from 'react'
import { ReactEditor } from '../plugin/react-editor'

export const EDITOR_TO_COMPOSING = new WeakMap<ReactEditor, boolean>()

/**
 * A React context for sharing the `composing` state of the editor.
 */
export const ComposingContext = createContext(false)

/**
 * Get the current `composing` state of the editor. It deals with `compositionstart`, `compositionupdate`, `compositionend` events.
 *
 * Composition events are triggered by typing (composing) with a language that uses a composition character (e.g. Chinese, Japanese, Korean, etc.) [example](https://en.wikipedia.org/wiki/Input_method#/media/File:Typing_%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4_in_Dubeolsik_keyboard_layout.gif).
 * @group Hooks
 */
export const useComposing = (): boolean => {
  return useContext(ComposingContext)
}
