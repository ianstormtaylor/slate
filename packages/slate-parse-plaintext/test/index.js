import { parsePlaintext } from 'slate-parse-plaintext'
import assert from 'assert'
import { fixtures } from '../../../support/fixtures'

describe('slate-parse-plaintext', () => {
  fixtures(__dirname, 'fixtures', ({ module }) => {
    const { input, output, options } = module
    const actual = parsePlaintext(input, options)
    assert.deepEqual(actual, output)
  })
})
