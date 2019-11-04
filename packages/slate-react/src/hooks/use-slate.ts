import { useMemo } from 'react'
import { ReactEditor } from '../plugin'
import { EditorConstructor } from 'slate'

/**
 * A thin wrapper around `useMemo` to make it easy to get an editor instance.
 */

export const useSlate = (
  Editor: EditorConstructor<ReactEditor>
): ReactEditor => {
  const editor = useMemo(() => new Editor(), [Editor])
  return editor
}
