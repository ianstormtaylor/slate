import assert from 'assert'

const {
  benchmarks,
  REQUIRED_BENCHMARK_IDS,
  verifyBatchPrototype,
} = require('./perf/set-nodes-bench')

describe('batch perf benchmark manifest', () => {
  it('keeps benchmark ids unique', () => {
    const ids = benchmarks.map(benchmark => benchmark.id)

    assert.equal(new Set(ids).size, ids.length)
  })

  it('keeps the required batch perf lanes registered', () => {
    const ids = new Set(benchmarks.map(benchmark => benchmark.id))

    for (const id of REQUIRED_BENCHMARK_IDS) {
      assert.ok(ids.has(id), `Missing required benchmark lane: ${id}`)
    }
  })

  it('keeps split batch-exit profiling wired to the real normalize loop', () => {
    const expectedPhases = [
      'flushBeforeNormalize',
      'commitBeforeNormalize',
      'normalize',
      'flushAfterNormalize',
      'commitAfterNormalize',
    ]

    for (const id of ['apply-batch-split-flat', 'with-batch-split-flat']) {
      const benchmark = benchmarks.find(candidate => candidate.id === id)

      assert.deepEqual(benchmark?.batchExitBreakdown, expectedPhases)
    }
  })

  it('keeps the benchmark prototype equivalence check green', () => {
    verifyBatchPrototype()
  })
})
