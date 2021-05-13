import { RefObject, useEffect, useState } from 'react'
import { Editor } from 'slate'

import { useSlateStatic } from '../../hooks/use-slate-static'

import { useMutationObserver } from './use-mutation-observer'
import { AndroidInputManager } from './android-input-manager'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true,
}

export function useAndroidInputManager(node: RefObject<HTMLElement>) {
  const editor = useSlateStatic()
  const [inputManager] = useState(() => new AndroidInputManager(editor))

  useMutationObserver(node, inputManager.flush, MUTATION_OBSERVER_CONFIG)

  return inputManager
}
