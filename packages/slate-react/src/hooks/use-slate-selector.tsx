import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import { Editor } from 'slate'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'

type EditorChangeHandler = (editor: Editor) => void

/**
 * A React context for sharing the editor selector context in a way to control rerenders
 */

export const SlateSelectorContext = createContext<{
  getSlate: () => Editor
  addEventListener: (callback: EditorChangeHandler) => () => void
}>({} as any)

const refEquality = (a: any, b: any) => a === b

/**
 * use useSyncExternalStore to prevent rerendering on every keystroke.
 * Bear in mind rerendering can only prevented if the returned value is a value type or for reference types (e.g. objects and arrays) add a custom equality function.
 *
 * Example:
 * ```
 *  const isSelectionActive = useSlateSelector(editor => Boolean(editor.selection));
 * ```
 */
export function useSlateSelector<T>(
  selector: (editor: Editor) => T,
  equalityFn: (a: T, b: T) => boolean = refEquality
) {
  const context = useContext(SlateSelectorContext)
  if (!context) {
    throw new Error(
      `The \`useSlateSelector\` hook must be used inside the <Slate> component's context.`
    )
  }
  const { getSlate, addEventListener } = context

  return useSyncExternalStoreWithSelector(
    addEventListener,
    getSlate,
    null,
    selector,
    equalityFn
  )
}

/**
 * Create selector context with editor updating on every editor change
 */
export function getSelectorContext(editor: Editor) {
  const eventListeners = useRef<EditorChangeHandler[]>([]).current
  const slateRef = useRef<{
    editor: Editor
  }>({
    editor,
  }).current
  const onChange = useCallback((editor: Editor) => {
    slateRef.editor = editor
    eventListeners.forEach((listener: EditorChangeHandler) => listener(editor))
  }, [])

  const selectorContext = useMemo(() => {
    return {
      getSlate: () => slateRef.editor,
      addEventListener: (callback: EditorChangeHandler) => {
        eventListeners.push(callback)
        return () => {
          eventListeners.splice(eventListeners.indexOf(callback), 1)
        }
      },
    }
  }, [eventListeners, slateRef])
  return { selectorContext, onChange }
}
