const { stdout } = process

module.exports = function(runner, utils) {
  let hasSuite = false
  let hasBench = false

  runner.on('start', () => {
    stdout.write('[')
  })

  runner.on('end', () => {
    stdout.write(']')
  })

  runner.on('suite start', suite => {
    if (hasSuite) stdout.write(',')
    stdout.write(`{"name":"${suite.title}","benchmarks":[`)
    hasSuite = true
  })

  runner.on('suite end', suite => {
    hasBench = false
    stdout.write(']}')
  })

  runner.on('bench end', bench => {
    if (hasBench) stdout.write(',')
    stdout.write(JSON.stringify(bench))
    hasBench = true
  })
}
