import { Editor, EditorInterface } from '../interfaces/editor'
import { PointRef } from '../interfaces/point-ref'

export const pointRef: EditorInterface['pointRef'] = (
  editor,
  point,
  options = {}
) => {
  const { affinity = 'forward' } = options
  const ref: PointRef = {
    current: point,
    affinity,
    unref() {
      const { current } = ref
      const pointRefs = Editor.pointRefs(editor)
      pointRefs.delete(ref)
      ref.current = null
      return current
    },
  }

  const refs = Editor.pointRefs(editor)
  refs.add(ref)
  return ref
}
