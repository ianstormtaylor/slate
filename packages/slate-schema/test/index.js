import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { SchemaPlugin } from '..'

describe('slate-schema', () => {
  fixtures(__dirname, 'errors', ({ module }) => {
    const { input, schema, output } = module
    const withSchema = SchemaPlugin(schema)
    const TestEditor = withSchema(Editor)
    const editor = new TestEditor({ value: input })
    editor.normalize({ force: true })
    assert.deepEqual(editor.value, output)
  })
})
