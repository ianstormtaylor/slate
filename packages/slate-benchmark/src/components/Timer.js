import { TimerType } from './types'

class Timer {
  construct(maxTime) {
    if (maxTime && maxTime > 0 && Number.isFinite(maxTime)) {
      this.maxTime = maxTime
    }
  }
  maxTimeTimerID = undefined
  isStopped = false
  start = {}
  elapsed = {}
  data = {};
  [TimerType]: true
  start() {
    this.start = process.cpuUsage()
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
    this.elapsed = process.cpuUsage(this.start)
    const { user, system } = this.elapsed
    this.data = {
      user,
      system,
      all: user + system,
    }
  }
}
export default Timer
