import { ReactEditor } from '../plugin/react-editor'

export const reportError = (editor: ReactEditor, error: unknown) => {
  if (typeof editor.onError !== 'function') {
    throw error
  }

  editor.onError(error)
}
