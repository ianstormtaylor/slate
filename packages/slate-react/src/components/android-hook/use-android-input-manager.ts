import { RefObject, useLayoutEffect, useState } from 'react'
import { useSlateStatic } from '../../hooks/use-slate-static'
import { IS_ANDROID } from '../../utils/environment'
import { useTrackUserInput } from '../android-hook/use-track-user-input'
import {
  createAndroidInputManager,
  CreateAndroidInputManagerOptions,
} from './android-input-manager'
import { useMutationObserver } from './use-mutation-observer'
import { useRestoreDom } from './use-restore-dom'
import { useIsMounted } from './use-is-mounted'

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
  'editor' | 'onUserInput' | 'receivedUserInput'
>

export function useAndroidInputManager({
  node,
  ...options
}: UseAndroidInputManagerOptions) {
  if (!IS_ANDROID) {
    return null
  }

  const editor = useSlateStatic()
  const isMounted = useIsMounted()

  const { receivedUserInput, onUserInput } = useTrackUserInput()
  const [inputManager] = useState(() =>
    createAndroidInputManager({
      receivedUserInput,
      editor,
      onUserInput,
      ...options,
    })
  )

  useMutationObserver(
    editor,
    node,
    inputManager.handleInput,
    MUTATION_OBSERVER_CONFIG
  )

  useLayoutEffect(() => () => {
    console.log('----------')
  })

  if (isMounted) {
    inputManager.flush()
  }

  useRestoreDom(node, receivedUserInput)
  return inputManager
}
