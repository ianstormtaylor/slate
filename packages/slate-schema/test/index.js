import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { defineSchema } from '..'

describe('slate-schema', () => {
  fixtures(__dirname, 'validations', ({ module }) => {
    const { input, schema, output } = module
    const withSchema = defineSchema(schema)
    const editor = withSchema(input)
    Editor.normalize(editor, { force: true })
    assert.deepEqual(editor.children, output.children)
  })
})
