import assert from 'assert'
import { repo, Suite } from '../../src'

describe('tries', async () => {
  const suite = new Suite('tries')
  const files = ['./min-tries', './max-tries']
  for (const file of files) {
    const module = require(file)
    it(module.experiment, () => {
      module.default(suite)
      const { actual, expected } = module
      repo.isFinished = false
      return repo.run().then(() => {
        assert.deepEqual(actual, expected)
      })
    })
  }
})
