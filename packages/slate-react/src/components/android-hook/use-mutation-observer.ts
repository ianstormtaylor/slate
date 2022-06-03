import { RefObject, useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { isDOMElement } from '../../utils/dom'
import { ReactEditor } from '../../plugin/react-editor'

export function isTrackedMutation(
  editor: ReactEditor,
  mutation: MutationRecord,
  batch: MutationRecord[]
): boolean {
  const { target } = mutation
  const parentMutation = batch.find(({ addedNodes, removedNodes }) => {
    const added = Array.from(addedNodes)
    if (added.includes(target) || added.some(node => node.contains(target))) {
      return true
    }

    const removed = Array.from(removedNodes)
    if (
      removed.includes(target) ||
      removed.some(node => node.contains(target))
    ) {
      return true
    }

    return false
  })

  // Target add/remove is tracked. Track the mutation if we track the parent mutation.
  if (parentMutation) {
    return isTrackedMutation(editor, parentMutation, batch)
  }

  const targetElement = (isDOMElement(target)
    ? target
    : target.parentElement) as HTMLElement | null

  if (!targetElement) {
    return false
  }

  if (targetElement === ReactEditor.toDOMNode(editor, editor)) {
    return true
  }

  if (!ReactEditor.hasDOMNode(editor, targetElement, { editable: true })) {
    return false
  }

  const voidParent = targetElement.closest('data-slate-void')

  // Mutation isn't inside a void element
  if (!voidParent) {
    return true
  }

  const block = targetElement.closest('[data-slate-node="element"]')

  // If mutation is inside a block inside a void element, track it.
  return !!block && voidParent.contains(block)
}

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

    // Attach mutation observer after render phase has finished
    mutationObserver.observe(node.current, options)

    // Clean up after effect
    return () => {
      mutationObserver.disconnect()
    }
  }, [])
}
