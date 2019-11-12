import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { withHelpers } from './helpers'
import { withHistory } from '..'

describe('slate-history', () => {
  fixtures(__dirname, 'undo', ({ module }) => {
    const { input, run, output } = module
    const TestEditor = withHelpers(withHistory(Editor))
    const editor = new TestEditor({ value: input })
    run(editor)
    editor.flush()
    editor.undo()
    assert.deepEqual(editor.value, output)
  })
})
