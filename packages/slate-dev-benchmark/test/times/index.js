import assert from 'assert'
import { repo, Suite, Bench } from '../../src'

describe('times', async () => {
  const suite = new Suite('min-tries', {
    minTries: 100,
    maxTries: 200,
    minTime: 100,
  })
  it('static min-tries', () => {
    const bench = new Bench(suite, 'static min-tries', { mode: 'static' })
    let index = 0
    bench.run(() => {
      index += 1
    })

    return repo.run().then(() => {
      assert.equal(index, 100)
    })
  })
  it('adaptive max-tries', () => {
    const bench = new Bench(suite, 'adpative max-tries')
    repo.isFinished = false
    let index = 0
    bench.run(() => {
      index += 1
    })

    return repo.run().then(() => {
      assert.equal(index, 300)
    })
  })
})
