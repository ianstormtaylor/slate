import { Editor, EditorInterface } from '../interfaces/editor'
import { PointRef } from '../interfaces/point-ref'

export const pointRef: EditorInterface['pointRef'] = (
  editor,
  point,
  options = {}
) => {
  const { affinity = 'forward', onChange = () => {} } = options
  const ref: PointRef = {
    current: point,
    affinity,
    onChange,
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
