/* global Promise */
function asyncSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function syncSleep(ms) {
  const start = process.hrtime()
  while (true) {
    const end = process.hrtime(start)
    if (end[0] * 1000 + end[1] / 1e6 > ms) return undefined
  }
}
export { syncSleep, asyncSleep }
