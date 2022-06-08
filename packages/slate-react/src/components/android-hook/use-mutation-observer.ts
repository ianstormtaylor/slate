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
  if (isDOMElement(target) && target.matches('[contentEditable="false"]')) {
    return false
  }

  const { document } = ReactEditor.getWindow(editor)
  if (document.contains(target)) {
    return ReactEditor.hasDOMNode(editor, target, { editable: true })
  }

  const parentMutation = batch.find(({ addedNodes, removedNodes }) => {
    for (const node of addedNodes) {
      if (node === target || node.contains(target)) {
        return true
      }
    }

    for (const node of removedNodes) {
      if (node === target || node.contains(target)) {
        return true
      }
    }
  })

  if (!parentMutation || parentMutation === mutation) {
    return false
  }

  // Target add/remove is tracked. Track the mutation if we track the parent mutation.
  return isTrackedMutation(editor, parentMutation, batch)
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

    mutationObserver.observe(node.current, options)
    return () => mutationObserver.disconnect()
  }, [])
}
