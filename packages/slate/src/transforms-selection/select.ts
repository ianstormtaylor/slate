import { Editor } from '../interfaces/editor'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { SelectionTransforms } from '../interfaces/transforms/selection'

export const select: SelectionTransforms['select'] = (editor, target) => {
  const { selection } = editor
  const range = Editor.range(editor, target)
  if (!range) return

  target = range

  if (selection) {
    Transforms.setSelection(editor, target)
    return
  }

  if (!Range.isRange(target)) {
    editor.onError('TransformsSelect', target)
    return
  }

  editor.apply({
    type: 'set_selection',
    properties: selection,
    newProperties: target,
  })
}
