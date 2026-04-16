import { Location } from '../interfaces'
import { Editor } from '../interfaces/editor'
import { Scrubber } from '../interfaces/scrubber'
import { Transforms } from '../interfaces/transforms'
import type { SelectionTransforms } from '../interfaces/transforms/selection'

export const select: SelectionTransforms['select'] = (editor, target) => {
  const { selection } = editor
  const range = Editor.range(editor, target)

  if (selection) {
    Transforms.setSelection(editor, range)
    return
  }

  if (!Location.isRange(range)) {
    throw new Error(
      `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${Scrubber.stringify(
        range
      )}`
    )
  }

  editor.apply({
    type: 'set_selection',
    properties: selection,
    newProperties: range,
  })
}
