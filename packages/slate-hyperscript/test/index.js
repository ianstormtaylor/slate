import assert from 'assert'
import { resolve } from 'path'
import { fixtures } from '../../../support/fixtures'

describe('slate-hyperscript', () => {
  fixtures(resolve(__dirname, 'fixtures'), ({ module }) => {
    const { input, output } = module
    assert.deepEqual(input, output)
  })
})
