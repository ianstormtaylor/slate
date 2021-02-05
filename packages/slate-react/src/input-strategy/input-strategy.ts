import { IS_ANDROID } from '../utils/environment'

import { InputStrategyArguments } from './types'
import { useBeforeInputStrategy } from './before-input'
import { useMutationObserverStrategy } from './mutation-observer'

export function getInputStrategy() {
  if (IS_ANDROID) {
    return useMutationObserverStrategy
  }

  return useBeforeInputStrategy
}

export const useInputStrategy = getInputStrategy()
