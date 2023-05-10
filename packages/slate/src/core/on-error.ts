import { Editor, EditorError } from '../interfaces'
import { SlateError, SlateErrorType } from '../interfaces/slate-error'

export const onError = <T extends SlateErrorType>(
  editor: Editor,
  type: T,
  ...args: Parameters<typeof SlateError[T]>
) => {
  const errorFn: (...args: any[]) => Omit<EditorError, 'error'> =
    SlateError[type]
  if (!errorFn) {
    throw new Error(`Unknown error type: ${type}`)
  }
  const error = errorFn(...args)

  editor.errors.push({
    ...error,
    error: new Error(error.message),
  })
}
