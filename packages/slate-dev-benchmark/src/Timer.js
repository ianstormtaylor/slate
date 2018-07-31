const { TimerType } = require('./types')

class Timer {
  constructor() {
    this.cpuStartTime = {}
    this.hrStartTime = null
    this.isStopped = false
    this.elapsed = {}
  }

  /**
   * Whether it is a Timer
   * @param {any} obj
   */

  isTimer(obj) {
    return obj && obj[TimerType]
  }

  /**
   * Start the timer
   * @return {void}
   */

  start() {
    this.isStopped = false
    this.cpuStartTime = process.cpuUsage()
    this.hrStartTime = process.hrtime()
    this.elapsed = {}
  }

  /**
   * Stop the timer and store restore in this.elapsed
   * @return {Object}
   */

  end() {
    if (this.isStopped) return this.elapsed
    const cpuElapsed = process.cpuUsage(this.cpuStartTime)
    const hrElapsed = process.hrtime(this.hrStartTime)
    const { user, system } = cpuElapsed
    const hr = hrElapsed[0] * 1000 + hrElapsed[1] / 1e6

    /**
     * user:    cpu time consumed in user space
     * system:  cpu time consumed in system space
     * all:     user+system
     * hr:      real world time
     * (unit): ms
     */

    this.elapsed = {
      user: user / 1000,
      system: system / 1000,
      all: (user + system) / 1000,
      hr,
    }

    this.isStopped = true
    return this.elapsed
  }
}

Timer.prototype[TimerType] = true

module.exports = { Timer }
