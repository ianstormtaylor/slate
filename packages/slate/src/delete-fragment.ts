import { WithEditorFirstArg } from './utils/types'
import { Range } from './interfaces/range'
import { Transforms } from './transforms'
import { Editor } from './interfaces/editor'

export const deleteFragment: WithEditorFirstArg<Editor['deleteFragment']> = (
  editor,
  { direction = 'forward' } = {}
) => {
  const { selection } = editor

  if (selection && Range.isExpanded(selection)) {
    Transforms.delete(editor, { reverse: direction === 'backward' })
  }
}
