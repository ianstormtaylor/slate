import { createEditor, Editor } from 'slate'
import { DOMEditor } from 'slate-dom'
import { ReactEditor, withReact } from '../src'

describe('hasRange compatibility', () => {
  it('keeps the DOM and React entry points working', () => {
    const editor = withReact(createEditor())
    editor.children = [{ children: [{ text: 'text' }] }]
    const point = { path: [0, 0], offset: 2 }
    const range = { anchor: point, focus: point }
    expect(DOMEditor.hasRange(editor, range)).toBe(true)
    expect(ReactEditor.hasRange(editor, range)).toBe(true)
    editor.children = []
    expect(Editor.hasRange(editor, range)).toBe(false)
    expect(DOMEditor.hasRange(editor, range)).toBe(false)
    expect(ReactEditor.hasRange(editor, range)).toBe(false)
  })

  it('uses the core editor override from both entry points', () => {
    const editor = withReact(createEditor())
    editor.hasRange = jest.fn(() => true)
    const point = { path: [5, 0], offset: 0 }
    const range = { anchor: point, focus: point }
    expect(DOMEditor.hasRange(editor, range)).toBe(true)
    expect(ReactEditor.hasRange(editor, range)).toBe(true)
    expect(editor.hasRange).toHaveBeenCalledTimes(2)
  })

  it('checks paths when an older slate has no editor.hasRange', () => {
    const editor = withReact(createEditor())
    editor.children = [{ children: [{ text: 'text' }] }]
    delete (editor as Partial<typeof editor>).hasRange
    const point = { path: [0, 0], offset: 2 }
    const range = { anchor: point, focus: point }
    expect(DOMEditor.hasRange(editor, range)).toBe(true)
    expect(ReactEditor.hasRange(editor, range)).toBe(true)
    editor.children = []
    expect(DOMEditor.hasRange(editor, range)).toBe(false)
  })
})
