/**
 * Define a Slate error.
 *
 * @type {SlateError}
 */

class SlateError extends Error {
  constructor(code, attrs = {}) {
    super(code)
    this.code = code

    for (const key in attrs) {
      this[key] = attrs[key]
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error().stack
    }
  }
}

/**
 * Export.
 *
 * @type {SlateError}
 */

export default SlateError
