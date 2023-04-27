import { EditorError } from './editor'

export type ErrorLogger = {
  errors: EditorError[]
  onError: (error: Omit<EditorError, 'error'>) => void
}

export interface ErrorLoggerInterface {
  onError: ErrorLogger['onError']
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
 * This interface implements an error store, which is used by Slate
 * internally on invalid calls of methods not depending on `editor`. Developers
 * using Slate may call ErrorLogger.setOnError() to alter the behavior of this
 * function.
 *
 * For example, to throw an error only for one method:
 *
 *    import { ErrorLogger } from 'slate';
 *    ErrorLogger.setOnError(error => {
 *     if (error.type === 'point') {
 *       throw new Error(error.message)
 *     }
 *     // ...push the error to ErrorLogger.errors
 *   });
 */
// eslint-disable-next-line no-redeclare
export const ErrorLogger: ErrorLoggerInterface = {
  onError(error) {
    _errorStore.onError(error)
  },

  setOnError(onError) {
    _errorStore.onError = onError
  },
}

export type Scrubber = (key: string, value: unknown) => unknown

export interface ScrubberInterface {
  setScrubber(scrubber: Scrubber | undefined): void
  stringify(value: any): string
}

let _scrubber: Scrubber | undefined = undefined

/**
 * This interface implements a stringify() function, which is used by Slate
 * internally when generating exceptions containing end user data. Developers
 * using Slate may call Scrubber.setScrubber() to alter the behavior of this
 * stringify() function.
 *
 * For example, to prevent the cleartext logging of 'text' fields within Nodes:
 *
 *    import { Scrubber } from 'slate';
 *    Scrubber.setScrubber((key, val) => {
 *      if (key === 'text') return '...scrubbed...'
 *      return val
 *    });
 *
 */
// eslint-disable-next-line no-redeclare
export const Scrubber: ScrubberInterface = {
  setScrubber(scrubber: Scrubber | undefined): void {
    _scrubber = scrubber
  },

  stringify(value: any): string {
    return JSON.stringify(value, _scrubber)
  },
}
