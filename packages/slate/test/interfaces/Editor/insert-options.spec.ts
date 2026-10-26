import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'

describe('insertion options', () => {
  it('inserts text at an explicit location instead of the selection', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'def' }] },
    ]
    const selection = { path: [0, 0], offset: 1 }
    Transforms.select(editor, selection)

    Editor.insertText(editor, 'X', { at: { path: [1, 0], offset: 1 } })

    assert.deepStrictEqual(editor.children, [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'dXef' }] },
    ])
    assert.deepStrictEqual(editor.selection, {
      anchor: selection,
      focus: selection,
    })
  })

  it('inserts text at an explicit location without a selection', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'def' }] },
    ]

    Editor.insertText(editor, 'X', { at: { path: [1, 0], offset: 1 } })

    assert.deepStrictEqual(editor.children, [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'dXef' }] },
    ])
    assert.strictEqual(editor.selection, null)
  })

  it('keeps pending marks for the caret when text goes to an explicit location', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'def' }] },
    ]
    Transforms.select(editor, { path: [0, 0], offset: 1 })
    Editor.addMark(editor, 'bold', true)

    Editor.insertText(editor, 'X', { at: { path: [1, 0], offset: 1 } })

    assert.deepStrictEqual(editor.children, [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'dXef' }] },
    ])
    assert.deepStrictEqual(editor.marks, { bold: true })

    Editor.insertText(editor, 'Y')

    assert.deepStrictEqual(editor.children, [
      { children: [{ text: 'a' }, { text: 'Y', bold: true }, { text: 'bc' }] },
      { children: [{ text: 'dXef' }] },
    ])
  })

  it('inserts and selects a node at an explicit location', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'def' }] },
    ]
    Transforms.select(editor, { path: [0, 0], offset: 1 })

    Editor.insertNode(
      editor,
      { children: [{ text: 'new' }] },
      { at: [1], select: true }
    )

    assert.deepStrictEqual(editor.children, [
      { children: [{ text: 'abc' }] },
      { children: [{ text: 'new' }] },
      { children: [{ text: 'def' }] },
    ])
    assert.deepStrictEqual(editor.selection, {
      anchor: { path: [1, 0], offset: 3 },
      focus: { path: [1, 0], offset: 3 },
    })
  })
})
