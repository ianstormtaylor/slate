import { RefObject, useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
import { isDOMElement } from '../utils/dom'
import { ReactEditor } from '../plugin/react-editor'

export function useMutationObserver(
  node: RefObject<HTMLElement>,
  callback: MutationCallback,
  options: MutationObserverInit
) {
  const [mutationObserver] = useState(() => new MutationObserver(callback))

  useIsomorphicLayoutEffect(() => {
    // Discard mutations caused during render phase. This works due to react calling
    // useLayoutEffect synchronously after the render phase before the next tick.
    mutationObserver.takeRecords()
  })

  useEffect(() => {
    if (!node.current) {
      throw new Error('Failed to attach MutationObserver, `node` is undefined')
    }

    mutationObserver.observe(node.current, options)
    return () => mutationObserver.disconnect()
  }, [mutationObserver, node, options])
}
