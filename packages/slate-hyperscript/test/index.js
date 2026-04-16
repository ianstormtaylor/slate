import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { fixtures } from '../../../support/fixtures'

describe('slate-hyperscript', () => {
  fixtures(resolve(__dirname, 'fixtures'), ({ module }) => {
    const { input, output } = module
    let actual = {}

    if (Array.isArray(output)) {
      actual = input
    } else {
      for (const key in output) {
        if (!Object.hasOwn(output, key)) continue
        actual[key] = input[key]
      }
    }

    assert.deepEqual(actual, output)
  })
})
