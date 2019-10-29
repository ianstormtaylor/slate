import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { HelpersPlugin } from './helpers'
import { HistoryPlugin } from '..'

describe('slate-history', () => {
  fixtures(__dirname, 'undo', ({ module }) => {
    const { input, run, output } = module
    const withHistory = HistoryPlugin()
    const withHelpers = HelpersPlugin()
    const TestEditor = withHelpers(withHistory(Editor))
    const editor = new TestEditor({ value: input })
    run(editor)
    editor.flush()
    editor.undo()
    assert.deepEqual(editor.value, output)
  })
})
