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
    const { hr, cycles } = bench
    result.push({
      name,
      type: 'bench',
      ...bench,
      elapsed: hr,
      iterations: cycles,
      ops: cycles / hr,
    })
  }
}

export default function generateReport(repo, filePath) {
  const data = JSON.stringify(convertRepo(repo.report))
  writeFileSync(filePath, data)
}
