const { writeFileSync } = require('fs')

function convertRepo(report) {
  const result = []

  for (const name in report) {
    const suite = report[name]

    result.push({
      name,
      type: 'suite',
      benchmarks: convertSuite(suite),
    })
  }
  return result
}

function convertSuite(suite) {
  const result = []

  for (const name in suite) {
    const bench = suite[name]
    const { user, cycles } = bench

    result.push({
      name,
      type: 'bench',
      elapsed: user,
      iterations: cycles,
      ops: 1000 * cycles / user,
      ...bench,
    })
  }
  return result
}

const IS_COMPARE = process.env.COMPARE
const filePath = IS_COMPARE
  ? './tmp/benchmark-comparison.json'
  : './tmp/benchmark-baseline.json'

function generateReport(repo) {
  repo
    .run()
    .then(report => {
      const data = JSON.stringify(convertRepo(report))
      writeFileSync(filePath, data)
      return report
    })
    .then(report => {
      if (IS_COMPARE) {
        require('./compare')
      }
    })
}

module.exports = { generateReport }
