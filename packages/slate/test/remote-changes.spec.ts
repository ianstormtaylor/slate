import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'

it('restores a remote scope after nested callbacks and exceptions', () => {
  const editor = createEditor()
  const other = createEditor()
  const failure = new Error('remote update failed')
  assert.strictEqual(Editor.isRemoteChange(editor), false)
  Editor.withRemoteChanges(editor, () => {
    assert.strictEqual(Editor.isRemoteChange(editor), true)
    assert.strictEqual(Editor.isRemoteChange(other), false)
    assert.throws(
      () =>
        Editor.withRemoteChanges(editor, () => {
          assert.strictEqual(Editor.isRemoteChange(editor), true)
          throw failure
        }),
      error => error === failure
    )
    assert.strictEqual(Editor.isRemoteChange(editor), true)
  })
  assert.strictEqual(Editor.isRemoteChange(editor), false)
  assert.throws(
    () =>
      Editor.withRemoteChanges(editor, () => {
        throw failure
      }),
    error => error === failure
  )
  assert.strictEqual(Editor.isRemoteChange(editor), false)
})

it('keeps selection metadata and restores local insertion behavior after the scope', () => {
  const editor = createEditor()
  editor.children = [{ children: [{ text: 'abc' }] }]
  editor.selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 3 },
    data: { source: 'local selection' },
  }
  Editor.withRemoteChanges(editor, () => {
    editor.apply({ type: 'insert_text', path: [0, 0], offset: 3, text: 'X' })
    editor.apply({ type: 'insert_text', path: [0, 0], offset: 0, text: 'Z' })
  })
  assert.deepStrictEqual(editor.selection, {
    anchor: { path: [0, 0], offset: 1 },
    focus: { path: [0, 0], offset: 4 },
    data: { source: 'local selection' },
  })
  Transforms.insertText(editor, 'Y', { at: { path: [0, 0], offset: 4 } })
  assert.strictEqual(editor.selection!.focus.offset, 5)
})

it('retains the existing fallback when a selected node is removed remotely', () => {
  const editor = createEditor()
  editor.children = ['one', 'two'].map(text => ({ children: [{ text }] }))
  Transforms.select(editor, {
    anchor: { path: [0, 0], offset: 1 },
    focus: { path: [1, 0], offset: 2 },
  })
  const node = editor.children[0]
  Editor.withRemoteChanges(editor, () =>
    editor.apply({ type: 'remove_node', path: [0], node })
  )
  assert.deepStrictEqual(editor.selection, {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 2 },
  })
  Editor.withRemoteChanges(editor, () =>
    editor.apply({ type: 'remove_node', path: [0], node: editor.children[0] })
  )
  assert.strictEqual(editor.selection, null)
})

it('does not create a selection for a remote edit', () => {
  const editor = createEditor()
  editor.children = [{ children: [{ text: 'abc' }] }]
  Editor.withRemoteChanges(editor, () =>
    editor.apply({ type: 'insert_text', path: [0, 0], offset: 3, text: 'X' })
  )
  assert.strictEqual(editor.selection, null)
})
