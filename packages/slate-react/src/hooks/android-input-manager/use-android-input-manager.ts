import { type RefObject, useState } from 'react'
import { EDITOR_TO_SCHEDULE_FLUSH, IS_ANDROID } from 'slate-dom'
import { useIsMounted } from '../use-is-mounted'
import { useMutationObserver } from '../use-mutation-observer'
import { useSlateStatic } from '../use-slate-static'
import {
  type CreateAndroidInputManagerOptions,
  createAndroidInputManager,
} from './android-input-manager'

type UseAndroidInputManagerOptions = {
  node: RefObject<HTMLElement | null>
} & Omit<
  CreateAndroidInputManagerOptions,
  'editor' | 'onUserInput' | 'receivedUserInput'
>

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
}

export const useAndroidInputManager = IS_ANDROID
  ? ({ node, ...options }: UseAndroidInputManagerOptions) => {
      if (!IS_ANDROID) {
        return null
      }

      const editor = useSlateStatic()
      const isMounted = useIsMounted()

      const [inputManager] = useState(() =>
        createAndroidInputManager({
          editor,
          ...options,
        })
      )

      useMutationObserver(
        node,
        inputManager.handleDomMutations,
        MUTATION_OBSERVER_CONFIG
      )

      EDITOR_TO_SCHEDULE_FLUSH.set(editor, inputManager.scheduleFlush)
      if (isMounted) {
        inputManager.flush()
      }

      return inputManager
    }
  : () => null
