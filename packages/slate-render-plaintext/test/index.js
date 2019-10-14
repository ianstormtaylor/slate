import { renderPlaintext } from 'slate-render-plaintext'
import assert from 'assert'
import { fixtures } from '../../../support/fixtures'

describe('slate-render-plaintext', () => {
  fixtures(__dirname, 'fixtures', ({ module }) => {
    const { input, output, options } = module
    const actual = renderPlaintext(input, options)
    assert.deepEqual(actual, output)
  })
})
