import { SelectionTransforms } from '../interfaces/transforms/selection'
import { Range } from '../interfaces/range'
import { Editor } from '../interfaces/editor'
import { Transforms } from '../interfaces/transforms'

export const move: SelectionTransforms['move'] = (editor, options = {}) => {
  const { selection } = editor
  const { distance = 1, unit = 'character', reverse = false } = options
  let { edge = null } = options

  if (!selection) {
    return
  }

  if (edge === 'start') {
    edge = Range.isBackward(selection) ? 'focus' : 'anchor'
  }

  if (edge === 'end') {
    edge = Range.isBackward(selection) ? 'anchor' : 'focus'
  }

  const { anchor, focus } = selection
  const opts = { distance, unit, ignoreNonSelectable: true }
  const props: Partial<Range> = {}

  if (edge == null || edge === 'anchor') {
    const point = reverse
      ? Editor.before(editor, anchor, opts)
      : Editor.after(editor, anchor, opts)

    if (point) {
      props.anchor = point
    }
  }

  if (edge == null || edge === 'focus') {
    const point = reverse
      ? Editor.before(editor, focus, opts)
      : Editor.after(editor, focus, opts)

    if (point) {
      props.focus = point
    }
  }

  Transforms.setSelection(editor, props)
}
