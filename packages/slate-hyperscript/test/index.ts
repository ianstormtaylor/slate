import assert from 'assert'
import { resolve } from 'path'
import { fixtures } from '../../../support/fixtures'

describe('slate-hyperscript', () => {
  fixtures<
    | {
        input: unknown[]
        output: unknown[]
      }
    | {
        input: Record<string, unknown>
        output: Record<string, unknown>
      }
  >(resolve(__dirname, 'fixtures'), ({ module }) => {
    const { input, output } = module
    let actual: unknown[] | Record<string, unknown> = {}

    if (Array.isArray(input)) {
      actual = input
    } else {
      for (const key in output) {
        actual[key] = input[key]
      }
    }

    assert.deepEqual(actual, output)
  })
})
