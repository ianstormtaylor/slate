import {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react'

import { useSlateStatic } from '../../hooks/use-slate-static'

import {
  createAndroidInputManager,
  CreateAndroidInputManagerOptions,
} from './android-input-manager'
import { useRestoreDom } from '../android-hook/use-restore-dom'
import { useMutationObserver } from './use-mutation-observer'
import { useTrackUserInput } from '../android-hook/use-track-user-input'
import { IS_ANDROID } from '../../utils/environment'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true,
}

type UseAndroidInputManagerOptions = {
  node: RefObject<HTMLElement>
} & Omit<
  CreateAndroidInputManagerOptions,
  'editor' | 'restoreDom' | 'onUserInput'
>

export function useAndroidInputManager({
  node,
  ...options
}: UseAndroidInputManagerOptions) {
  if (!IS_ANDROID) {
    return null
  }

  const editor = useSlateStatic()

  const { receivedUserInput, onUserInput } = useTrackUserInput()
  const restoreDom = useRestoreDom(node, receivedUserInput)

  const [inputManager] = useState(() =>
    createAndroidInputManager({ editor, restoreDom, onUserInput, ...options })
  )

  useMutationObserver(
    node,
    inputManager.handleMutations,
    MUTATION_OBSERVER_CONFIG
  )

  inputManager.flush()
  return inputManager
}
