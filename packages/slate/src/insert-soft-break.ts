import { WithEditorFirstArg } from './utils/types'
import { Transforms } from './transforms'
import { Editor } from './interfaces/editor'

export const insertSoftBreak: WithEditorFirstArg<Editor['insertSoftBreak']> = editor => {
  Transforms.splitNodes(editor, { always: true })
}
