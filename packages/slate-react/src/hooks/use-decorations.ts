import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { DecoratedRange, Descendant, Node, NodeEntry } from 'slate'
import { isTextDecorationsEqual, isElementDecorationsEqual } from 'slate-dom'
import { useSlateStatic } from './use-slate-static'
import { ReactEditor } from '../plugin/react-editor'
import { useGenericSelector } from './use-generic-selector'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

type Callback = () => void

/**
 * A React context for sharing the `decorate` prop of the editable and
 * subscribing to changes on this prop.
 */

export const DecorateContext = createContext<{
  decorate: (entry: NodeEntry) => DecoratedRange[]
  addEventListener: (callback: Callback) => () => void
}>({} as any)

export const useDecorations = (
  node: Descendant,
  parentDecorations: DecoratedRange[]
): DecoratedRange[] => {
  const editor = useSlateStatic()
  const { decorate, addEventListener } = useContext(DecorateContext)

  // Not memoized since we want nodes to be decorated on each render
  const selector = () => {
    const path = ReactEditor.findPath(editor, node)
    return decorate([node, path])
  }

  const equalityFn = Node.isText(node)
    ? isTextDecorationsEqual
    : isElementDecorationsEqual

  const [decorations, update] = useGenericSelector(selector, equalityFn)

  useIsomorphicLayoutEffect(() => {
    const unsubscribe = addEventListener(update)
    update()
    return unsubscribe
  }, [addEventListener, update])

  return useMemo(
    () => [...decorations, ...parentDecorations],
    [decorations, parentDecorations]
  )
}

export const useDecorateContext = (
  decorateProp: (entry: NodeEntry) => DecoratedRange[]
) => {
  const [, forceUpdate] = useReducer(s => s + 1, 0)
  const eventListeners = useRef(new Set<Callback>())

  const latestDecorate = useRef(decorateProp)

  useIsomorphicLayoutEffect(() => {
    latestDecorate.current = decorateProp
    eventListeners.current.forEach(listener => listener())
    // Force Editable to re-render in the same batch as the text components
    // notified above, so its selection-restoration layout effect runs after
    // the decoration-induced DOM changes are committed. Without this, the
    // text components restructure the DOM in a separate pass where
    // Editable's layout effect never fires, potentially leaving the caret
    // at a wrong position.
    forceUpdate()
  }, [decorateProp])

  const decorate = useCallback(
    (entry: NodeEntry) => latestDecorate.current(entry),
    []
  )

  const addEventListener = useCallback((callback: Callback) => {
    eventListeners.current.add(callback)

    return () => {
      eventListeners.current.delete(callback)
    }
  }, [])

  return useMemo(
    () => ({ decorate, addEventListener }),
    [decorate, addEventListener]
  )
}
