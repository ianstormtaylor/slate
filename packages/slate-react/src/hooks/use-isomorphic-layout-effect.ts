import { useLayoutEffect, useEffect } from 'react'
import { CAN_USE_DOM } from 'slate-dom'

/**
 * Prevent warning on SSR by falling back to useEffect when DOM isn't available
 */

export const useIsomorphicLayoutEffect = CAN_USE_DOM
  ? useLayoutEffect
  : useEffect
