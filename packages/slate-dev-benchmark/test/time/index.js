import { repo, Suite } from '../..'
import fs from 'fs'
import { resolve } from 'path'

describe('time', async () => {
  const suite = new Suite('tries')
  const testDir = resolve(__dirname)
  const files = fs
    .readdirSync(testDir)
    .filter(x => x[0] !== '.' && x !== 'index.js')

  for (const file of files) {
    const module = require(`./${file}`)

    it(module.experiment, () => {
      module.default(suite)
      const { expected } = module
      repo.isFinished = false
      return repo.run().then(() => expected())
    })
  }
})
