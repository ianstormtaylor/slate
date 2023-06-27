import { Editor } from '../interfaces/editor'
import { Transforms } from '../interfaces/transforms'
import { Range } from '../interfaces/range'
import { WithEditorFirstArg } from '../utils/types'

export const deleteForward: WithEditorFirstArg<Editor['deleteForward']> = (
  editor,
  unit
) => {
  const { selection } = editor

  if (selection && Range.isCollapsed(selection)) {
    Transforms.delete(editor, { unit })
  }
}
