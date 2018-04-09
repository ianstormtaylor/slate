if (process) {
  if (typeof process.cpuUsage === 'function') {
    module.exports = require('./cpuUsage')
  } else if (typeof process.hrtime === 'function') {
    module.exports = require('./hrtimer')
  }
} else {
 module.exports =  require('./date')
}
