/**
 * A function that does nothing
 * @return {Function}
 */

function noop() {}

/**
 * Creates an executor like a `resolver` or a `deleter` that handles
 * delayed execution of a method using a `requestAnimationFrame` or `setTimeout`.
 *
 * Unlike a `requestAnimationFrame`, after a method is cancelled, it can be
 * resumed. You can also optionally add a `timeout` after which time the
 * executor is automatically cancelled.
 */

export default class Executor {
  /**
   * Executor
   * @param {window} window
   * @param {Function} fn - the function to execute when done
   * @param {Object} options
   */

  constructor(window, fn, options = {}) {
    this.fn = fn
    this.window = window
    this.resume()
    this.onCancel = options.onCancel
    this.__setTimeout__(options.timeout)
  }

  __call__ = () => {
    // I don't clear the timeout since it will be noop'ed anyways. Less code.
    this.fn()
    this.preventFurtherCalls() // Ensure you can only call the function once
  }

  /**
   * Make sure that the function cannot be executed any more, even if other
   * methods attempt to call `__call__`.
   */

  preventFurtherCalls = () => {
    this.fn = noop
  }

  /**
   * Resume the executor's timer, usually after it has been cancelled.
   *
   * @param {Number} [ms] - how long to wait by default it is until next frame
   */

  resume = ms => {
    // in case resume is called more than once, we don't want old timers
    // from executing because the `timeoutId` or `callbackId` is overwritten.
    this.cancel()

    if (ms) {
      this.mode = 'timeout'
      this.timeoutId = this.window.setTimeout(this.__call__, ms)
    } else {
      this.mode = 'animationFrame'
      this.callbackId = this.window.requestAnimationFrame(this.__call__)
    }
  }

  /**
   * Cancel the executor from executing after the wait. This can be resumed
   * with the `resume` method.
   */

  cancel = () => {
    if (this.mode === 'timeout') {
      this.window.clearTimeout(this.timeoutId)
    } else {
      this.window.cancelAnimationFrame(this.callbackId)
    }

    if (this.onCancel) this.onCancel()
  }

  /**
   * Sets a timeout after which this executor is automatically cancelled.
   * @param {Number} ms
   */

  __setTimeout__ = timeout => {
    if (timeout == null) return

    this.window.setTimeout(() => {
      this.cancel()
      this.preventFurtherCalls()
    }, timeout)
  }
}
