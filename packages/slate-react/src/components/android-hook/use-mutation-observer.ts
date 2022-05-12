import { RefObject, useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'

export function useMutationObserver(
  node: RefObject<HTMLElement>,
  callback: MutationCallback,
  options: MutationObserverInit
) {
  const [mutationObserver] = useState(() => new MutationObserver(callback))

  useIsomorphicLayoutEffect(() => {
    // Disconnect mutation observer during render phase
    mutationObserver.disconnect()
  })

  useEffect(() => {
    if (!node.current) {
      throw new Error('Failed to attach MutationObserver, `node` is undefined')
    }

    // Attach mutation observer after render phase has finished
    mutationObserver.observe(node.current, options)

    // Clean up after effect
    return mutationObserver.disconnect.bind(mutationObserver)
  })
}
