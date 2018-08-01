import assert from 'assert'
import { Value } from '../..'
import { fixtures } from 'slate-dev-test-utils'

describe('serializers', () => {
  describe('raw', () => {
    fixtures(__dirname, 'raw', 'deserialize', ({ module }) => {
      const { input, output, options } = module
      const actual = Value.fromJSON(input, options).toJSON()
      const expected = output.toJSON()
      assert.deepEqual(actual, expected)
    })

    fixtures(__dirname, 'raw', 'serialize', ({ module }) => {
      const { input, output, options } = module
      const actual = input.toJSON(options)
      const expected = output
      assert.deepEqual(actual, expected)
    })
  })
})
