import { SelectionTransforms } from '../interfaces/transforms/selection'
import { Editor } from '../interfaces/editor'
import { Transforms } from '../interfaces/transforms'
import { Range } from '../interfaces/range'
import { Scrubber } from '../interfaces/scrubber'

export const select: SelectionTransforms['select'] = (editor, target) => {
  const { selection } = editor
  target = Editor.range(editor, target)

  if (selection) {
    Transforms.setSelection(editor, target)
    return
  }

  if (!Range.isRange(target)) {
    throw new Error(
      `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${Scrubber.stringify(
        target
      )}`
    )
  }

  editor.apply({
    type: 'set_selection',
    properties: selection,
    newProperties: target,
  })
}
