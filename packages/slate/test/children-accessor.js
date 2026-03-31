import assert from 'assert'
import { createEditor, Editor } from 'slate'

describe('createEditor children accessor', () => {
  it('defines children as an enumerable accessor with normal editor semantics', () => {
    const editor = createEditor()
    const descriptor = Object.getOwnPropertyDescriptor(editor, 'children')
    const value = [{ type: 'paragraph', children: [{ text: 'one' }] }]

    assert.equal(typeof descriptor?.get, 'function')
    assert.equal(typeof descriptor?.set, 'function')
    assert.equal(descriptor?.enumerable, true)

    editor.children = value

    assert.equal(editor.children, value)
    assert(Object.keys(editor).includes('children'))
    assert(Editor.isEditor(editor, { deep: true }))
  })
})
