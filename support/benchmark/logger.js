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

const { stdout } = process

export default function generateReport(repo) {
  stdout(JSON.stringify(convertRepo(repo.report)))
}
