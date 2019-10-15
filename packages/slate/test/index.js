import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { TestPlugin } from './helpers'

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
  fixtures(__dirname, 'interfaces', ({ module }) => {
    const { input, test, output } = module
    const result = test(input)
    assert.deepEqual(result, output)
  })

  fixtures(__dirname, 'operations', ({ module }) => {
    const { input, operations, output } = module
    const TestEditor = TestPlugin(Editor)
    const editor = new TestEditor({ value: input })

    for (const op of operations) {
      editor.apply(op)
    }

    assert.deepEqual(editor.value, output)
  })

  fixtures(__dirname, 'normalization', ({ module }) => {
    const { input, output } = module
    const TestEditor = TestPlugin(Editor)
    const editor = new TestEditor({ value: input })
    editor.normalize({ force: true })
    assert.deepEqual(editor.value, output)
  })

  // The hyperscript editor has the schema, but the test
  // editor doesn't! It needs to live in the tests instead.

  fixtures(__dirname, 'commands', ({ module }) => {
    const { input, output, options = {}, plugins: module_plugins } = module
    const fn = module.default
    const editor = new Editor({
      plugins: module_plugins ? plugins.concat(module_plugins) : plugins,
    })
    const opts = { preserveSelection: true, ...options }

    editor.setValue(input)
    fn(editor)
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
