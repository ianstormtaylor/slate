import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { withSchema } from '..'

describe('slate-schema', () => {
  fixtures(__dirname, 'validations', ({ module }) => {
    const { input, schema, output } = module
    const editor = withSchema(input, schema)
    Editor.normalize(editor, { force: true })
    assert.deepEqual(editor.children, output.children)
  })
})
