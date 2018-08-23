import assert from 'assert'
import { fixtures } from 'slate-dev-test-utils'
import { Node, Schema, Value } from 'slate'

describe('slate', () => {
  fixtures(__dirname, 'models/leaf', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const actual = fn(input).toJSON()
    const expected = output.toJSON()
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'models/text', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const actual = fn(input).toJSON()
    const expected = output.toJSON()
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'models/node', ({ module }) => {
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

  fixtures(__dirname, 'models/change', ({ module }) => {
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

  fixtures(__dirname, 'serializers/raw/deserialize', ({ module }) => {
    const { input, output, options } = module
    const actual = Value.fromJSON(input, options).toJSON()
    const expected = output.toJSON()
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'serializers/raw/serialize', ({ module }) => {
    const { input, output, options } = module
    const actual = input.toJSON(options)
    const expected = output
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'operations', ({ module }) => {
    const { input, output } = module
    const operations = module.default
    const change = input.change()
    change.applyOperations(operations)
    const opts = {
      preserveSelection: true,
      preserveDecorations: true,
      preserveData: true,
    }
    const actual = change.value.toJSON(opts)
    const expected = output.toJSON(opts)
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'changes', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const change = input.change()
    fn(change)
    const opts = { preserveSelection: true, preserveData: true }
    const actual = change.value.toJSON(opts)
    const expected = output.toJSON(opts)
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'schema', ({ module }) => {
    let { input, output, schema } = module
    const s = Schema.create(schema)

    if (!Value.isValue(input)) {
      input = Value.fromJSON(input)
    }

    let expected = output
    let actual = input
      .change()
      .setValue({ schema: s })
      .normalize().value

    if (Value.isValue(actual)) actual = actual.toJSON()
    if (Value.isValue(expected)) expected = expected.toJSON()

    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'history', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const next = fn(input)
    const opts = { preserveSelection: true, preserveData: true }
    const actual = next.toJSON(opts)
    const expected = output.toJSON(opts)
    assert.deepEqual(actual, expected)
  })
})
