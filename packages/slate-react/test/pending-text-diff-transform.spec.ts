import { createEditor } from 'slate'
import { EDITOR_TO_PENDING_DIFFS } from 'slate-dom'
import { withReact } from '../src'

const pendingDiffAfterInsert = (offset: number) => {
  const editor = withReact(createEditor())
  editor.children = [{ children: [{ text: 'abcd' }] }]
  EDITOR_TO_PENDING_DIFFS.set(editor, [
    { id: 1, path: [0, 0], diff: { start: 2, end: 2, text: 'x' } },
  ])
  editor.apply({ type: 'insert_text', path: [0, 0], offset, text: 'yz' })
  return EDITOR_TO_PENDING_DIFFS.get(editor)
}

describe('pending text diffs', () => {
  it('keep a pending insertion in place when text is inserted at its offset', () => {
    expect(pendingDiffAfterInsert(2)).toEqual([
      { id: 1, path: [0, 0], diff: { start: 2, end: 2, text: 'x' } },
    ])
  })

  it('shift a pending insertion when text is inserted before it', () => {
    expect(pendingDiffAfterInsert(1)).toEqual([
      { id: 1, path: [0, 0], diff: { start: 4, end: 4, text: 'x' } },
    ])
  })
})
