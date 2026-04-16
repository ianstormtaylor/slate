import type { EditorInterface } from '../interfaces/editor'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'

export const deleteFragment: EditorInterface['deleteFragment'] = (
  editor,
  { direction = 'forward' } = {}
) => {
  const { selection } = editor

  if (selection && Range.isExpanded(selection)) {
    Transforms.delete(editor, { reverse: direction === 'backward' })
  }
}
