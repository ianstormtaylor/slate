import { SelectionTransforms } from '../interfaces/transforms/selection'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'

export const setPoint: SelectionTransforms['setPoint'] = (
  editor,
  props,
  options = {}
) => {
  const { selection } = editor
  let { edge = 'both' } = options

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
  const point = edge === 'anchor' ? anchor : focus

  Transforms.setSelection(editor, {
    [edge === 'anchor' ? 'anchor' : 'focus']: { ...point, ...props },
  })
}
