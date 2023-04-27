import { EditorError } from './editor'

export type ErrorLogger = {
  errors: EditorError[]
  onError: (error: Omit<EditorError, 'error'>) => void
}

export interface ErrorLoggerInterface {
  errors: ErrorLogger['errors']
  onError: ErrorLogger['onError']
  resetErrors(): void
  setOnError(onError: ErrorLogger['onError']): void
}

const _errors: EditorError[] = []
const _errorStore: ErrorLogger = {
  errors: _errors,
  onError: error => {
    try {
      throw new Error(error.message)
    } catch (err) {
      _errors.push({
        ...error,
        error: err,
      })
    }
  },
}
/**
 * This interface implements an error logger, which is used by Slate
 * internally on invalid calls of methods not depending on `editor`. Developers
 * using Slate may call ErrorLogger.setOnError() to alter the behavior of this
 * function.
 *
 * For example, to throw an error only for one case:
 *
 *    import { ErrorLogger } from 'slate';
 *    ErrorLogger.setOnError(error => {
 *     if (error.type === 'insert_text') {
 *       throw new Error(error.message)
 *     }
 *     // ...push the error to ErrorLogger.errors
 *   });
 */
// eslint-disable-next-line no-redeclare
export const ErrorLogger: ErrorLoggerInterface = {
  errors: _errorStore.errors,
  onError(error) {
    _errorStore.onError(error)
  },

  resetErrors() {
    _errorStore.errors = []
  },
  setOnError(onError) {
    _errorStore.onError = onError
  },
}
