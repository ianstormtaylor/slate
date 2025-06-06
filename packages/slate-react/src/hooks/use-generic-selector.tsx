import { useCallback, useReducer, useRef } from 'react'

/**
 * Create a selector that updates when an `update` function is called, and
 * which only causes the component to render when the result of `selector`
 * differs from the previous result according to `equalityFn`.
 *
 * If `selector` is memoized using `useCallback`, then it will only be called
 * when it changes or when `update` is called. Otherwise, `selector` will be
 * called every time the component renders.
 *
 * @example
 * const [state, update] = useGenericSelector(selector, equalityFn)
 *
 * useIsomorphicLayoutEffect(() => {
 *   return addEventListener(update)
 * }, [addEventListener, update])
 *
 * return state
 */

export function useGenericSelector<T>(
  selector: () => T,
  equalityFn: (a: T | null, b: T) => boolean
): [state: T, update: () => void] {
  const [, forceRender] = useReducer(s => s + 1, 0)

  const latestSubscriptionCallbackError = useRef<Error | undefined>()
  const latestSelector = useRef<() => T>(() => null as any)
  const latestSelectedState = useRef<T | null>(null)
  let selectedState: T

  try {
    if (
      selector !== latestSelector.current ||
      latestSubscriptionCallbackError.current
    ) {
      const selectorResult = selector()

      if (equalityFn(latestSelectedState.current, selectorResult)) {
        selectedState = latestSelectedState.current as T
      } else {
        selectedState = selectorResult
      }
    } else {
      selectedState = latestSelectedState.current as T
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current && isError(err)) {
      err.message += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\n`
    }

    throw err
  }

  latestSelector.current = selector
  latestSelectedState.current = selectedState
  latestSubscriptionCallbackError.current = undefined

  const update = useCallback(() => {
    try {
      const newSelectedState = latestSelector.current()

      if (equalityFn(latestSelectedState.current, newSelectedState)) {
        return
      }

      latestSelectedState.current = newSelectedState
    } catch (err) {
      // we ignore all errors here, since when the component
      // is re-rendered, the selectors are called again, and
      // will throw again, if neither props nor store state
      // changed
      if (err instanceof Error) {
        latestSubscriptionCallbackError.current = err
      } else {
        latestSubscriptionCallbackError.current = new Error(String(err))
      }
    }

    forceRender()

    // don't rerender on equalityFn change since we want to be able to define it inline
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [selectedState, update]
}

function isError(error: any): error is Error {
  return error instanceof Error
}
