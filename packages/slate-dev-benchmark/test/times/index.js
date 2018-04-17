import assert from 'assert'
import { repo, Suite, Bench } from '../../src'

describe('min-tries', async () => {
  const suite = new Suite('min-tries', { minTries: 100, mode: 'static' })
  it('static', () => {
    const bench = new Bench(suite, 'min-tries')
    let index = 0
    bench.run(() => {
      index += 1
    })

    return repo.run().then(() => {
      assert.equal(index, 100)
    })
  })
})
