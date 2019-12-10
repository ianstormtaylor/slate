import { useLayoutEffect, useEffect } from 'react'

/**
 * Prevent warning on SSR by falling back to useEffect when window is not defined
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
