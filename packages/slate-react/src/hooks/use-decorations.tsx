import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import { Node, NodeEntry, BaseRange } from 'slate'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'
import { ReactEditor } from '..'
import { useSlateStatic } from './use-slate-static'
import { isDecoratorRangeListEqual } from '../utils/range-list'

type DecorationsList = (BaseRange & { placeholder?: string | undefined })[]
type DecorateFn = (entry: NodeEntry) => DecorationsList
type DecorateChangeHandler = (decorate: DecorateFn) => void

/**
 * A React context for decorate context in a way to control rerenders
 */

export const DecorateContext = createContext<{
  getDecorate: () => DecorateFn
  addEventListener: (callback: DecorateChangeHandler) => () => void
}>({} as any)

export function useDecorations(node: Node) {
  const editor = useSlateStatic()
  const context = useContext(DecorateContext)

  if (!context) {
    throw new Error(
      `The \`useDecorations\` hook must be used inside the <Slate> component's context.`
    )
  }
  const { getDecorate, addEventListener } = context

  const getDecorations = (decorate: DecorateFn) => {
    const path = ReactEditor.findPath(editor, node)
    return decorate([node, path])
  }

  return useSyncExternalStoreWithSelector(
    addEventListener,
    getDecorate,
    null,
    getDecorations,
    isDecoratorRangeListEqual
  )
}

/**
 * Create decoration context with updating on every decorator change
 */
export function getDecorateContext(decorate: DecorateFn) {
  const eventListeners = useRef<DecorateChangeHandler[]>([]).current
  const decorateRef = useRef<{ decorate: DecorateFn }>({ decorate }).current
  const onDecorateChange = useCallback((decorate: DecorateFn) => {
    decorateRef.decorate = decorate
    eventListeners.forEach((listener: DecorateChangeHandler) =>
      listener(decorate)
    )
  }, [])

  const decorateContext = useMemo(() => {
    return {
      getDecorate: () => decorateRef.decorate,
      addEventListener: (callback: DecorateChangeHandler) => {
        eventListeners.push(callback)
        return () => {
          eventListeners.splice(eventListeners.indexOf(callback), 1)
        }
      },
    }
  }, [eventListeners, decorateRef])
  return { decorateContext, onDecorateChange }
}
