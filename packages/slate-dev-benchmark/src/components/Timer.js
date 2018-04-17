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
  startTime = {}
  maxTimeTimerID = undefined
  isStopped = false
  elapsed = {}
  start() {
    this.startTime = process.cpuUsage()
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
    const elapsed = process.cpuUsage(this.startTime)
    const { user, system } = elapsed
    this.elapsed = {
      user: user / 1000,
      system: system / 1000,
      all: (user + system) / 1000,
    }
  }
}
Timer.prototype[TimerType] = true
export default Timer
