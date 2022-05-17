import { MutableRefObject, RefObject, useState } from 'react'
import { useSlateStatic } from '../..'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { createRestoreDomManager } from './restore-dom-manager'
import { useMutationObserver } from './use-mutation-observer'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true,
}

export function useRestoreDom(
  node: RefObject<HTMLElement>,
  receivedUserInput: MutableRefObject<boolean>
) {
  const editor = useSlateStatic()
  const [restoreDOMManager] = useState(() =>
    createRestoreDomManager(editor, receivedUserInput)
  )

  useMutationObserver(
    editor,
    node,
    restoreDOMManager.registerMutations,
    MUTATION_OBSERVER_CONFIG
  )

  useIsomorphicLayoutEffect(() => {
    restoreDOMManager.clear()
  })

  restoreDOMManager.restoreDOM()
}
