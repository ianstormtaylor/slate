import assert from 'assert'
import { fixtures } from 'slate-dev-test-utils'
import { Node, Editor, Value } from 'slate'

const plugins = [
  {
    schema: {
      blocks: {
        image: {
          isVoid: true,
        },
      },
      inlines: {
        emoji: {
          isVoid: true,
        },
      },
      marks: {
        result: {
          isAtomic: true,
        },
      },
    },
  },
]

describe('slate', () => {
  fixtures(__dirname, 'models/leaf', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const actual = fn(input).toJSON()
    const expected = output.toJSON()
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'models/point', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const actual = fn(input)
    const expected = output
    assert.equal(actual, expected)
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
    const editor = new Editor({ plugins })

    const opts = {
      preserveSelection: true,
      preserveDecorations: true,
    }

    editor.setValue(input)

    editor.change(change => {
      change.applyOperations(operations)
    })

    const actual = editor.value.toJSON(opts)

    editor.setValue(output)
    const expected = editor.value.toJSON(opts)
    assert.deepEqual(actual, expected)
  })

  // The hyperscript editor has the schema, but the test
  // editor doesn't! It needs to live in the tests instead.

  fixtures(__dirname, 'commands', ({ module }) => {
    const { input, output, options = {} } = module
    const fn = module.default
    const editor = new Editor({ plugins })
    const opts = { preserveSelection: true, ...options }

    editor.setValue(input)
    editor.change(fn)
    const actual = editor.value.toJSON(opts)

    editor.setValue(output)
    const expected = editor.value.toJSON(opts)
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'schema', ({ module }) => {
    const { input, output, schema } = module
    const editor = new Editor({ value: input, plugins: [{ schema }] })
    const actual = editor.value.toJSON()
    const expected = output.toJSON()
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'history', ({ module }) => {
    const { input, output } = module
    const fn = module.default
    const editor = new Editor({ plugins })
    const opts = { preserveSelection: true }

    editor.setValue(input)
    fn(editor)
    const actual = editor.value.toJSON(opts)

    editor.setValue(output)
    const expected = output.toJSON(opts)

    assert.deepEqual(actual, expected)
  })
})
