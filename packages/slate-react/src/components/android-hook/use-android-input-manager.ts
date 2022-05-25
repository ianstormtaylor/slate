import { RefObject, useLayoutEffect, useState } from 'react'
import { useSlateStatic } from '../../hooks/use-slate-static'
import { IS_ANDROID } from '../../utils/environment'
import { EDITOR_TO_FLUSH_PENDING_CHANGES } from '../../utils/weak-maps'
import { useTrackUserInput } from '../android-hook/use-track-user-input'
import {
  createAndroidInputManager,
  CreateAndroidInputManagerOptions,
} from './android-input-manager'
import { useIsMounted } from './use-is-mounted'
import { useRestoreDom } from './use-restore-dom'

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

  EDITOR_TO_FLUSH_PENDING_CHANGES.set(editor, inputManager.flush)

  if (isMounted) {
    inputManager.flush()
  }

  useRestoreDom(node, receivedUserInput)
  return inputManager
}
