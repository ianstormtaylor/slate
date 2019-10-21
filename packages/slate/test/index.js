import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { TestPlugin } from './helpers'

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

  fixtures(__dirname, 'queries', ({ module }) => {
    const { input, run, output } = module
    const TestEditor = TestPlugin(Editor)
    const editor = new TestEditor({ value: input })
    const result = run(editor)
    assert.deepEqual(result, output)
  })

  fixtures(__dirname, 'commands', ({ module }) => {
    const { input, run, output } = module
    const TestEditor = TestPlugin(Editor)
    const editor = new TestEditor({ value: input })
    run(editor)
    assert.deepEqual(editor.value, output)
  })
})
