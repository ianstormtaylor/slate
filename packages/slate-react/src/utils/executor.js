// Creates an executor like a `resolver` or a `deleter` that handles
// delayed execution of a method using a `requestAnimationFrame`.
//
// Unlike a `requestAnimationFrame`, after a method is cancelled, it can be
// resumed. You can also optionally add a `timeout` after which time the
// executor is automatically cancelled.

function noop() {}

export default class Executor {
  constructor(window, fn, timeout) {
    this.fn = fn
    this.window = window
    this.resume()
    this.__setTimeout__(timeout)
  }

  __call__ = () => {
    // I don't clear the timeout since it will be noop'ed anyways. Less code.
    this.fn()
    this.preventFurtherCalls() // Ensure you can only call the function once
  }

  preventFurtherCalls = () => {
    this.fn = noop
  }

  resume = () => {
    // in case resume is called more than once, we don't want old animation
    // frames from executing because the `callbackId` is overwritten
    this.cancel()
    this.callbackId = this.window.requestAnimationFrame(this.__call__)
  }

  // Cancel the animation frame callback
  cancel = () => {
    if (this.callbackId) {
      this.window.cancelAnimationFrame(this.callbackId)
    }
  }

  // If the method is not __call__'ed before a given timeout period, we
  // cancel it permanently.
  __setTimeout__ = timeout => {
    if (timeout == null) return
    this.window.setTimeout(() => {
      this.cancel()
      this.preventFurtherCalls()
    }, timeout)
  }
}
