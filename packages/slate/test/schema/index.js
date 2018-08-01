import assert from 'assert'
import { Schema } from '../..'
import { fixtures } from 'slate-dev-test-utils'

describe('schema', () => {
  fixtures(__dirname, 'core', ({ module }) => {
    const { input, output, schema } = module
    const s = Schema.create(schema)
    const expected = output
    const actual = input
      .change()
      .setValue({ schema: s })
      .normalize()
      .value.toJSON()

    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'custom', ({ module }) => {
    const { input, output, schema } = module
    const s = Schema.create(schema)
    const expected = output.toJSON()
    const actual = input
      .change()
      .setValue({ schema: s })
      .normalize()
      .value.toJSON()

    assert.deepEqual(actual, expected)
  })
})
