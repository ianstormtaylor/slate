import { SelectionTransforms } from '../interfaces/transforms/selection'

/** @ignore */
export const deselect: SelectionTransforms['deselect'] = editor => {
  const { selection } = editor

  if (selection) {
    editor.apply({
      type: 'set_selection',
      properties: selection,
      newProperties: null,
    })
  }
}
