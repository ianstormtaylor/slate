import { WithEditorFirstArg } from '../utils'
import { Editor } from '../interfaces'

export const onError: WithEditorFirstArg<Editor['onError']> = (
  editor,
  error
) => {
  try {
    throw new Error(error.message)
  } catch (err) {
    editor.errors.push({
      ...error,
      error: err,
    })
  }
}
