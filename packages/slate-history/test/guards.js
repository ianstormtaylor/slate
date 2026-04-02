import assert from 'assert'
import { createEditor, Transforms } from '../../slate/src'
import { History, HistoryCommand, HistoryEditor, withHistory } from '../src'

describe('slate-history guards', () => {
  it('returns false for malformed history batch entries', () => {
    assert.equal(History.isHistory({ redos: [null], undos: [] }), false)
    assert.equal(
      History.isHistory({
        redos: [{}],
        undos: [],
      }),
      false
    )
    assert.equal(
      History.isHistory({
        redos: [],
        undos: [{}],
      }),
      false
    )
  })

  it('still accepts master-era history entry arrays', () => {
    assert.equal(
      History.isHistory({
        redos: [[{ type: 'insert_text', path: [0, 0], offset: 0, text: 'a' }]],
        undos: [],
      }),
      true
    )
  })

  it('returns false for nullish history editors', () => {
    assert.equal(HistoryEditor.isHistoryEditor(null), false)
    assert.equal(HistoryEditor.isHistoryEditor(undefined), false)
  })

  it('still accepts real history editors', () => {
    const editor = withHistory(createEditor())

    assert.equal(HistoryEditor.isHistoryEditor(editor), true)
  })

  it('supports undo and redo command objects through exec', () => {
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }

    assert.equal(HistoryCommand.isUndoCommand({ type: 'undo' }), true)
    assert.equal(HistoryCommand.isRedoCommand({ type: 'redo' }), true)

    Transforms.insertText(editor, '!')

    editor.exec({ type: 'undo' })

    assert.deepEqual(editor.children, [
      { type: 'paragraph', children: [{ text: 'one' }] },
    ])

    editor.exec({ type: 'redo' })

    assert.deepEqual(editor.children, [
      { type: 'paragraph', children: [{ text: 'o!ne' }] },
    ])
  })
})
