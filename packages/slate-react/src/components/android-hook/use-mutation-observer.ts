import { RefObject, useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { ReactEditor } from '../../plugin/react-editor'
import { EDITOR_TO_MUTATION_OBSERVERS } from '../../utils/weak-maps'

export function useMutationObserver(
  editor: ReactEditor,
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

    // Register mutation observer
    const mutationObservers =
      EDITOR_TO_MUTATION_OBSERVERS.get(editor) ?? new Set()
    mutationObservers.add(mutationObserver)
    EDITOR_TO_MUTATION_OBSERVERS.set(editor, mutationObservers)

    // Attach mutation observer after render phase has finished
    mutationObserver.observe(node.current, options)

    // Clean up after effect
    return () => {
      mutationObserver.disconnect()
      EDITOR_TO_MUTATION_OBSERVERS.get(editor)?.delete(mutationObserver)
    }
  }, [])
}
