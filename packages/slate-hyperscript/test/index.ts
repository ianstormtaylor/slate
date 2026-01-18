import assert from 'assert'
import { resolve } from 'path'
import { fixtures } from '../../../support/fixtures'

describe('slate-hyperscript', () => {
  fixtures(resolve(__dirname, 'fixtures'), ({ module }) => {
    const { input, output } = module
    let actual = {}

    if (Array.isArray(output)) {
      actual = input
    } else {
      for (const key in output) {
        actual[key] = input[key]
      }
    }

    assert.deepEqual(actual, output)
  })
})
