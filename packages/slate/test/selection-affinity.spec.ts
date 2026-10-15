import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'

for (const remote of [false, true]) {
  for (const backward of [false, true]) {
    for (const offset of [0, 3]) {
      it(`${remote ? 'remote' : 'local'} insertion at ${offset} in a ${
        backward ? 'backward' : 'forward'
      } selection`, () => {
        const editor = createEditor()
        editor.children = [{ children: [{ text: 'abc' }] }]
        const start = { path: [0, 0], offset: 0 }
        const end = { path: [0, 0], offset: 3 }
        Transforms.select(editor, {
          anchor: backward ? end : start,
          focus: backward ? start : end,
        })
        const apply = () =>
          editor.apply({ type: 'insert_text', path: [0, 0], offset, text: 'X' })
        if (remote) Editor.withRemoteChanges(editor, apply)
        else apply()
        const expectedStart = { path: [0, 0], offset: offset === 0 ? 1 : 0 }
        const expectedEnd = {
          path: [0, 0],
          offset: offset === 0 || !remote ? 4 : 3,
        }
        assert.deepStrictEqual(editor.selection, {
          anchor: backward ? expectedEnd : expectedStart,
          focus: backward ? expectedStart : expectedEnd,
        })
      })
    }
  }
}

it('moves a collapsed caret forward inside a remote scope', () => {
  const editor = createEditor()
  editor.children = [{ children: [{ text: 'abc' }] }]
  Transforms.select(editor, { path: [0, 0], offset: 3 })
  Editor.withRemoteChanges(editor, () => {
    editor.apply({ type: 'insert_text', path: [0, 0], offset: 3, text: 'X' })
  })
  const point = { path: [0, 0], offset: 4 }
  assert.deepStrictEqual(editor.selection, { anchor: point, focus: point })
})
