import { Editor } from '../interfaces/editor'
import { Scrubber } from '../interfaces/index'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { SelectionTransforms } from '../interfaces/transforms/selection'

export const select: SelectionTransforms['select'] = (editor, target) => {
  const { selection } = editor
  const range = Editor.range(editor, target)
  if (!range) {
    editor.onError({
      key: 'select.range.1',
      message: `Cannot select a non-existent range: ${Scrubber.stringify(
        target
      )}`,
      data: { target },
    })
    return
  }

  target = range

  if (selection) {
    Transforms.setSelection(editor, target)
    return
  }

  if (!Range.isRange(target)) {
    editor.onError({
      key: 'select.range.2',
      message: `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${Scrubber.stringify(
        target
      )}`,
      data: { target },
    })
    return
  }

  editor.apply({
    type: 'set_selection',
    properties: selection,
    newProperties: target,
  })
}
