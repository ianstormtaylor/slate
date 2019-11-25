import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor, createEditor } from 'slate'
import { withSchema } from '..'

describe('slate-schema', () => {
  fixtures(__dirname, 'validations', ({ module }) => {
    const { input, schema, output } = module
    const editor = withSchema(createEditor(), schema)
    editor.value = input
    Editor.normalize(editor, { force: true })
    assert.deepEqual(editor.value, output)
  })
})
