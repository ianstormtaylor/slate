import { WithEditorFirstArg } from './utils/types'
import { Transforms } from './transforms'
import { Editor } from './interfaces/editor'

export const insertNode: WithEditorFirstArg<Editor['insertNode']> = (
  editor,
  node
) => {
  Transforms.insertNodes(editor, node)
}
