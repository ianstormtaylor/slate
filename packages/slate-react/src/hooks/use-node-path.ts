import { useMemo } from 'react'
import { useSlateStatic } from './use-slate-static'
import { Node } from 'slate'
import { ReactEditor } from '../plugin/react-editor'
import { usePathRef } from './use-path-ref'

export const useNodePath = (node: Node) => {
  const editor = useSlateStatic()
  const key = ReactEditor.findKey(editor, node)
  const path = useMemo(
    () => ReactEditor.findPath(editor, node),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, key]
  )

  return usePathRef(path, { affinity: 'backward' })
}
