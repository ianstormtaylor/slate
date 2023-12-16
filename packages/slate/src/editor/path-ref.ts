import { Editor, EditorInterface } from '../interfaces/editor'
import { PathRef } from '../interfaces/path-ref'

export const pathRef: EditorInterface['pathRef'] = (
  editor,
  path,
  options = {}
) => {
  const { affinity = 'forward' } = options
  const ref: PathRef = {
    current: path,
    affinity,
    unref() {
      const { current } = ref
      const pathRefs = Editor.pathRefs(editor)
      pathRefs.delete(ref)
      ref.current = null
      return current
    },
  }

  const refs = Editor.pathRefs(editor)
  refs.add(ref)
  return ref
}
