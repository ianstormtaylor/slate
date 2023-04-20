import { Editor, EditorInterface } from '../interfaces/editor'
import { RangeRef } from '../interfaces/range-ref'

export const rangeRef: EditorInterface['rangeRef'] = (
  editor,
  range,
  options = {}
) => {
  const { affinity = 'forward' } = options
  const ref: RangeRef = {
    current: range,
    affinity,
    unref() {
      const { current } = ref
      const rangeRefs = Editor.rangeRefs(editor)
      rangeRefs.delete(ref)
      ref.current = null
      return current
    },
  }

  const refs = Editor.rangeRefs(editor)
  refs.add(ref)
  return ref
}
