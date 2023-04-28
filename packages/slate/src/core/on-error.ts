import { Editor } from '../interfaces'
import { WithEditorFirstArg } from '../utils'

export const onError: WithEditorFirstArg<Editor['onError']> = (
  editor,
  error
) => {
  editor.errors.push({
    ...error,
    error: new Error(error.message),
  })
}
