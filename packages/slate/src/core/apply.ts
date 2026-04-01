import { WithEditorFirstArg } from '../utils/types'
import { Editor } from '../interfaces/editor'
import { runOperation } from './apply-operation'
import { isBatching, scheduleOnChange } from './batch'
import { applyOperationBatch, applyOperationInBatch } from './apply-batch'

export { applyOperationBatch } from './apply-batch'

const applyOperationNormally: WithEditorFirstArg<Editor['apply']> = (
  editor,
  op
) => {
  runOperation(editor, op)
  scheduleOnChange(editor)
}

export const apply: WithEditorFirstArg<Editor['apply']> = (editor, op) => {
  if (isBatching(editor)) {
    applyOperationInBatch(editor, op)
    return
  }

  applyOperationNormally(editor, op)
}
