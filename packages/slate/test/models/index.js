import assert from 'assert'
import { Node, Schema } from '../..'
import { fixtures } from 'slate-dev-test-utils'

describe('models', () => {
  fixtures(__dirname, 'leaf', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const actual = fn(input).toJSON()
    const expected = output.toJSON()
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'text', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const actual = fn(input).toJSON()
    const expected = output.toJSON()
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'node', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    let actual = fn(input)
    let expected = output

    if (Node.isNode(actual)) {
      actual = actual.toJSON()
    }

    if (Node.isNode(expected)) {
      expected = expected.toJSON()
    }

    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'change', ({ module }) => {
    const { input, output, schema, flags, customChange } = module
    const s = Schema.create(schema)
    const expected = output.toJSON()
    const actual = input
      .change(flags)
      .setValue({ schema: s })
      .withoutNormalization(customChange)
      .value.toJSON()

    assert.deepEqual(actual, expected)
  })
})
