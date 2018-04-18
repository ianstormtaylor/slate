import { TimerType } from './types'

class Timer {
  constructor(maxTime) {
    if (maxTime && maxTime > 0 && Number.isFinite(maxTime)) {
      this.maxTime = maxTime
    }
  }
  isTimer(obj) {
    return obj && obj[TimerType]
  }
  cpuStartTime = {}
  hrStartTime = null
  maxTimeTimerID = undefined
  isStopped = false
  elapsed = {}
  start() {
    this.cpuStartTime = process.cpuUsage()
    this.hrStartTime = process.hrtime()
    this.isStopped = false
    if (this.maxTime) {
      this.maxTimeTimerID = setTimeout(() => {
        this.end()
      }, this.maxTime)
    }
  }
  end() {
    if (this.isStopped) return
    clearTimeout(this.maxTimeTimerID)
    this.maxTimeTimerID = undefined
    this.isStopped = true
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
  }
}
Timer.prototype[TimerType] = true
export default Timer
