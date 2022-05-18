import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { Node, NodeEntry, BaseRange } from 'slate'
import { ReactEditor } from '..'
import { useSlateStatic } from './use-slate-static'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
import { isDecoratorRangeListEqual } from '../utils/range-list'

function isError(error: any): error is Error {
  return error instanceof Error
}

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

/**
 * use redux style selectors to prevent rerendering on every decorate change
 */
export function useDecorations(node: Node) {
  const [iteration, forceRender] = useReducer(s => s + 1, 0)
  const editor = useSlateStatic()
  const context = useContext(DecorateContext)

  if (!context) {
    throw new Error(
      `The \`useDecorations\` hook must be used inside the <Slate> component's context.`
    )
  }
  const { getDecorate, addEventListener } = context

  const latestSubscriptionCallbackError = useRef<Error | undefined>()
  const latestNode = useRef<Node>(node)
  const latestDecorationState = useRef<DecorationsList>([])
  let decorationState: DecorationsList

  try {
    if (
      iteration === 0 ||
      node !== latestNode.current ||
      latestSubscriptionCallbackError.current
    ) {
      const path = ReactEditor.findPath(editor, node)
      decorationState = getDecorate()([node, path])
    } else {
      decorationState = latestDecorationState.current
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current && isError(err)) {
      err.message += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\n`
    }

    throw err
  }
  useIsomorphicLayoutEffect(() => {
    latestNode.current = node
    latestDecorationState.current = decorationState
    latestSubscriptionCallbackError.current = undefined
  })

  useIsomorphicLayoutEffect(
    () => {
      function checkForUpdates() {
        try {
          const path = ReactEditor.findPath(editor, latestNode.current)
          const newDecorationState = getDecorate()([latestNode.current, path])

          if (
            isDecoratorRangeListEqual(
              newDecorationState,
              latestDecorationState.current
            )
          ) {
            return
          }

          latestDecorationState.current = newDecorationState
        } catch (err) {
          // we ignore all errors here, since when the component
          // is re-rendered, the selectors are called again, and
          // will throw again, if neither props nor store state
          // changed
          latestSubscriptionCallbackError.current = err
        }

        forceRender()
      }

      const unsubscribe = addEventListener(checkForUpdates)
      return () => unsubscribe()
    },
    // don't rerender on equalityFn change since we want to be able to define it inline
    [addEventListener, getDecorate]
  )

  return decorationState
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
