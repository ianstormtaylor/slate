import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { withSchema } from '..'

describe('slate-schema', () => {
  fixtures(__dirname, 'errors', ({ module }) => {
    const { input, schema, output } = module
    const TestEditor = withSchema(Editor, schema)
    const editor = new TestEditor({ value: input })
    editor.normalize({ force: true })
    assert.deepEqual(editor.value, output)
  })
})
