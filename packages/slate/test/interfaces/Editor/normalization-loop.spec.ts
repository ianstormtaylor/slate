import assert from 'assert'
import { createEditor, Editor, Element, Transforms } from 'slate'

describe('normalization loop errors', () => {
  it('identifies the pending path without serializing document contents', () => {
    const editor = createEditor()
    editor.children = [{ children: [{ text: 'private content' }] }]
    const { normalizeNode } = editor
    editor.normalizeNode = ([node, path], options) => {
      if (Element.isElement(node)) {
        Transforms.setNodes(
          editor,
          { type: node.type === 'one' ? 'two' : 'one' },
          { at: path }
        )
        return
      }
      normalizeNode([node, path], options)
    }

    assert.throws(
      () => Editor.normalize(editor, { force: true }),
      error => {
        assert(error instanceof Error)
        assert.match(error.message, /Could not completely normalize the editor/)
        assert.match(error.message, /Next dirty path: \[0\]/)
        assert.match(error.message, /normalizeNode/)
        assert(!error.message.includes('private content'))
        return true
      }
    )
    assert(Editor.isNormalizing(editor))
  })

  it('still normalizes a document that converges', () => {
    const editor = createEditor()
    editor.children = [{ children: [{ text: 'one' }, { text: 'two' }] }]
    Editor.normalize(editor, { force: true })
    assert.deepStrictEqual(editor.children, [
      { children: [{ text: 'onetwo' }] },
    ])
  })
})
