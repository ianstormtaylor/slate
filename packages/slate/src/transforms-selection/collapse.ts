import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import type { SelectionTransforms } from '../interfaces/transforms/selection'

export const collapse: SelectionTransforms['collapse'] = (
  editor,
  options = {}
) => {
  const { edge = 'anchor' } = options
  const { selection } = editor

  if (!selection) {
    return
  }
  if (edge === 'anchor') {
    Transforms.select(editor, selection.anchor)
  } else if (edge === 'focus') {
    Transforms.select(editor, selection.focus)
  } else if (edge === 'start') {
    const [start] = Range.edges(selection)
    Transforms.select(editor, start)
  } else if (edge === 'end') {
    const [, end] = Range.edges(selection)
    Transforms.select(editor, end)
  }
}
