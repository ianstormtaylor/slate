import { Editor } from '../interfaces'
import { EditorError, SlateErrorType } from '../interfaces/slate-errors'

export const onError = <T extends SlateErrorType>(
  editor: Editor,
  context: EditorError
): any => {
  const { message, recovery } = context

  if (editor.strict) throw new Error(message)

  editor.errors.push(context)

  return recovery
}
