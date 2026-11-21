import assert from 'assert/strict'
import { createEditor, Range, Transforms } from 'slate'

describe('transform identity', () => {
  it('returns separate anchor and focus points for a moved collapsed range', () => {
    const point = { path: [0, 0], offset: 1 }
    const result = Range.transform(
      { anchor: point, focus: { ...point } },
      { type: 'insert_text', path: [0, 0], offset: 0, text: 'a' }
    )!
    assert.deepEqual(result.anchor, { path: [0, 0], offset: 2 })
    assert.notEqual(result.anchor, result.focus)
  })

  it('returns separate anchor and focus points when an operation collapses a range', () => {
    const result = Range.transform(
      {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 0], offset: 3 },
      },
      { type: 'remove_text', path: [0, 0], offset: 1, text: 'ab' }
    )!
    assert.ok(Range.isCollapsed(result))
    assert.notEqual(result.anchor, result.focus)
  })

  it('keeps the selection object when removing a node outside it', () => {
    const editor = createEditor()
    editor.children = [
      { children: [{ text: 'one' }] },
      { children: [{ text: 'two' }] },
    ]
    Transforms.select(editor, { path: [0, 0], offset: 1 })
    const selection = editor.selection
    Transforms.removeNodes(editor, { at: [1] })
    assert.equal(editor.selection, selection)
  })
})
