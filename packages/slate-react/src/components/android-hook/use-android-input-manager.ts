import { RefObject, useState, useLayoutEffect } from 'react'
import { useSlateStatic } from '../../hooks/use-slate-static'
import { IS_ANDROID } from '../../utils/environment'
import { EDITOR_TO_SCHEDULE_FLUSH } from '../../utils/weak-maps'
import {
  createAndroidInputManager,
  CreateAndroidInputManagerOptions,
} from './android-input-manager'
import { useIsMounted } from './use-is-mounted'

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

  useLayoutEffect(() => console.log('------'))

  const [inputManager] = useState(() =>
    createAndroidInputManager({
      editor,
      ...options,
    })
  )

  EDITOR_TO_SCHEDULE_FLUSH.set(editor, inputManager.flush)
  if (isMounted) {
    inputManager.flush()
  }

  return inputManager
}
