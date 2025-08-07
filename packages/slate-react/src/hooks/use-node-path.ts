import { useMemo } from 'react'
import { useSlateStatic } from './use-slate-static'
import { Node } from 'slate'
import { ReactEditor } from '../plugin/react-editor'
import { usePathRef } from './use-path-ref'

export const useNodePath = (node: Node) => {
  const editor = useSlateStatic()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const path = useMemo(() => ReactEditor.findPath(editor, node), [node])

  return usePathRef(path, { affinity: 'backward' })
}
