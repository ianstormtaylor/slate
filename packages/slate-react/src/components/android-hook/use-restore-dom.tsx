import { MutableRefObject, RefObject, useRef, useState } from 'react'
import { useSlateStatic } from '../..'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { createRestoreDomManager } from './restore-dom-manager'
import { useMutationObserver } from './use-mutation-observer'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  subtree: true,
  characterData: true,
  childList: true,
  attributes: true,
  characterDataOldValue: true,
}

export function useRestoreDom(
  node: RefObject<HTMLElement>,
  receivedUserInput: MutableRefObject<boolean>
) {
  const editor = useSlateStatic()
  const [undoManager] = useState(() =>
    createRestoreDomManager(editor, receivedUserInput)
  )

  useMutationObserver(
    node,
    undoManager.registerMutations,
    MUTATION_OBSERVER_CONFIG
  )

  useIsomorphicLayoutEffect(() => {
    undoManager.clearMutations()
  })

  return undoManager.undoMutations
}
