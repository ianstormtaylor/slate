import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { EditorInterface } from '../interfaces/editor'

export const deleteFragment: EditorInterface['deleteFragment'] = (
  editor,
  { direction = 'forward' } = {}
) => {
  const { selection } = editor

  if (selection && Range.isExpanded(selection)) {
    Transforms.delete(editor, { reverse: direction === 'backward' })
  }
}
