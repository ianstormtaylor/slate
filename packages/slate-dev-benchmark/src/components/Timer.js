const { TimerType } = require('./types')

class Timer {
  constructor() {
    this.cpuStartTime = {}
    this.hrStartTime = null
    this.isStopped = false
    this.elapsed = {}
  }
  isTimer(obj) {
    return obj && obj[TimerType]
  }
  start() {
    this.isStopped = false
    this.cpuStartTime = process.cpuUsage()
    this.hrStartTime = process.hrtime()
  }
  end() {
    if (this.isStopped) return
    const cpuElapsed = process.cpuUsage(this.cpuStartTime)
    const hrElapsed = process.hrtime(this.hrStartTime)
    const { user, system } = cpuElapsed
    const hr = hrElapsed[0] * 1000 + hrElapsed[1] / 1e6
    this.elapsed = {
      user: user / 1000,
      system: system / 1000,
      all: (user + system) / 1000,
      hr,
    }
    this.isStopped = true
  }
}
Timer.prototype[TimerType] = true

module.exports = { Timer }
