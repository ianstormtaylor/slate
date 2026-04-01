import assert from 'assert'
import { createEditor, Transforms } from '../../slate/src'
import { withHistory } from '../src'

const flushMicrotasks = async () => {
  await Promise.resolve()
}

describe('slate-history redo behavior', () => {
  it('restores the post-operation selection when redo replays a selecting command', async () => {
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }

    Transforms.insertNodes(
      editor,
      { type: 'paragraph', children: [{ text: 'two' }] },
      { at: [1], select: true }
    )

    const selectionAfterInsert = JSON.parse(JSON.stringify(editor.selection))

    await flushMicrotasks()

    editor.undo()
    editor.redo()

    assert.deepEqual(editor.selection, selectionAfterInsert)
  })

  it('keeps redo operations when undo runs before the pending flush', () => {
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }

    Transforms.splitNodes(editor)

    const childrenAfterSplit = JSON.parse(JSON.stringify(editor.children))

    editor.undo()

    assert.equal(editor.history.redos.length, 1)
    assert.equal(editor.history.redos[0].operations.length, 2)

    editor.redo()

    assert.deepEqual(editor.children, childrenAfterSplit)
  })
})
