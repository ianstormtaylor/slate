/* eslint-disable no-redeclare */
import { EditorError } from './editor'

/**
 * This interface implements an error logger, which is used by Slate
 * internally on invalid calls of methods not depending on `editor`. Developers
 * using Slate may call ErrorLogger.addErrorHandler() to alter the behavior of this
 * function.
 *
 * For example, to throw an error only for one case:
 *
 * import { ErrorLogger } from 'slate';
 * ErrorLogger.addErrorHandler(error => {
 *   if (error.type === 'insert_text') {
 *     throw new Error(error.message)
 *   }
 *   // ...push the error to ErrorLogger.errors or in your own error store
 * });
 */
class _ErrorLogger {
  private errors: EditorError[] = []
  private handlers: Array<(error: Omit<EditorError, 'error'>) => void> = []

  onError = (error: Omit<EditorError, 'error'>) => {
    this.errors.push({
      ...error,
      error: new Error(error.message),
    })
    this.handlers.forEach(handler => handler(error))
  }

  resetErrors() {
    this.errors = []
  }

  addErrorHandler(handler: (error: Omit<EditorError, 'error'>) => void) {
    this.handlers.push(handler)
  }

  removeErrorHandler(handler: (error: Omit<EditorError, 'error'>) => void) {
    const index = this.handlers.indexOf(handler)
    if (index !== -1) {
      this.handlers.splice(index, 1)
    }
  }

  getErrors() {
    return this.errors
  }
}

/**
 * This interface implements an error logger, which is used by Slate
 * internally on invalid calls of methods not depending on `editor`. Developers
 * using Slate may call ErrorLogger.addErrorHandler() to alter the behavior of this
 * function.
 *
 * For example, to throw an error only for one case:
 *
 * import { ErrorLogger } from 'slate';
 * ErrorLogger.addErrorHandler((error, errors) => {
 *   // handle error
 *   console.error(error);
 *
 *   // access errors array
 *   console.log(errors);
 * });
 */
export const ErrorLogger = new _ErrorLogger()

export type ErrorLogger = _ErrorLogger
