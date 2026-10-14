import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'

for (const nested of [false, true]) {
  for (const isolated of [false, true]) {
    it(`deletes a hanging whole top-level block with nested=${nested}, isolated=${isolated}`, () => {
      const editor = createEditor()
      const blocks = ['one', 'two', 'three'].map(text => ({
        children: [{ text }],
      }))
      editor.children = nested ? [{ children: blocks }] : blocks
      editor.isIsolated = () => isolated
      const prefix = nested ? [0] : []
      Transforms.select(editor, {
        anchor: { path: [...prefix, 1, 0], offset: 0 },
        focus: { path: [...prefix, 2, 0], offset: 0 },
      })
      Editor.deleteFragment(editor, { direction: 'backward' })
      const expected =
        isolated || nested ? ['one', '', 'three'] : ['one', 'three']
      assert.deepStrictEqual(
        expected.map((_, index) => Editor.string(editor, [...prefix, index])),
        expected
      )
      assert.strictEqual(Editor.pathRefs(editor).size, 0)
    })
  }
}

it('deletes a trailing void block when the whole document is selected', () => {
  const editor = createEditor()
  editor.isVoid = element => 'type' in element && element.type === 'image'
  editor.children = [
    { children: [{ text: 'one' }] },
    { type: 'image', children: [{ text: '' }] } as any,
  ]
  Transforms.select(editor, {
    anchor: Editor.start(editor, []),
    focus: Editor.end(editor, []),
  })
  Editor.deleteFragment(editor)
  assert.deepStrictEqual(editor.children, [{ children: [{ text: '' }] }])
})
