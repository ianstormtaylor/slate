import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'

describe('Editor.hasRange', () => {
  it('checks both paths for collapsed, expanded and backward ranges', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ text: 'one' }, { children: [{ text: 'two' }] }] },
    ]
    const anchor = { path: [0, 0], offset: 1 }
    const focus = { path: [0, 1, 0], offset: 2 }
    for (const range of [
      { anchor, focus },
      { anchor: focus, focus: anchor },
      { anchor, focus: anchor },
    ]) {
      assert(Editor.hasRange(editor, range))
      assert(editor.hasRange(range))
    }
    const missing = { path: [2, 0], offset: 0 }
    assert(!Editor.hasRange(editor, { anchor: missing, focus }))
    assert(!Editor.hasRange(editor, { anchor, focus: missing }))
  })

  it('returns false after an endpoint is removed', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ text: 'one' }] },
      { children: [{ text: 'two' }] },
    ]
    const range = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [1, 0], offset: 2 },
    }
    Transforms.removeNodes(editor, { at: [1] })
    assert(!Editor.hasRange(editor, range))
  })

  it('preserves the path-only semantics of DOMEditor.hasRange', () => {
    const editor = createEditor()
    editor.children = [{ children: [{ text: '' }] }]
    const point = { path: [0, 0], offset: 100 }
    assert(Editor.hasRange(editor, { anchor: point, focus: point }))
  })

  it('delegates to the editor override', () => {
    const editor = createEditor()
    let called = false
    editor.hasRange = () => {
      called = true
      return true
    }
    const point = { path: [0, 0], offset: 0 }
    assert(Editor.hasRange(editor, { anchor: point, focus: point }))
    assert(called)
  })
})
