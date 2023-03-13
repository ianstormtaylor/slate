import { WithEditorFirstArg } from './utils/types'
import { Transforms } from './transforms'
import { Editor } from './interfaces/editor'

export const insertBreak: WithEditorFirstArg<Editor['insertBreak']> = editor => {
  Transforms.splitNodes(editor, { always: true })
}
