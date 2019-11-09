import { useMemo } from 'react'

import { ReactEditor } from '../plugin'

/**
 * A thin wrapper around `useMemo` to make it easy to get an editor instance.
 */

export const useSlate = <E extends ReactEditor>(
  Editor: new (...args: any[]) => E
): E => {
  const editor = useMemo(() => new Editor(), [Editor])
  return editor
}
