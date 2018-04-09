/* !
 * Matcha - High-res timer for Node.js
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/* !
 * Primary Export
 */

module.exports = Timer

/**
 * Timer (constructor)
 *
 * Constructs a timer that will return a high accuracy
 * elapsed calculation.
 *
 * @api public
 */

function Timer() {
  this._start = null
  this._elapsed = null
}

/**
 * .elapsed
 *
 * Calculate the milliseconds elapsed time
 * for the given elapsed hrdiff.
 *
 * @returns Number ms elapsed since start
 */

Object.defineProperty(Timer.prototype, 'elapsed', {
  get() {
    if (!this._elapsed) return null
    const { user, system } = this._elapsed
    return (user + system) / 1000
  },
})

/**
 * .start ()
 *
 * Mark the starting point for this timer.
 *
 * @api public
 */

Timer.prototype.start = function() {
  this._start = process.cpuUsage()
  return this
}

/**
 * .stop ()
 *
 * Mark the stopping point for this timer.
 * using hrtimes built in differ capability.
 *
 * @api public
 */

Timer.prototype.stop = function() {
  this._elapsed = process.cpuUsage(this._start)
  return this
}
