import assert from 'assert'
import { createEditor, Transforms } from '../../slate/src'
import { withHistory } from '../src'

const flushMicrotasks = async () => {
  await Promise.resolve()
}

describe('slate-history redo behavior', () => {
  it('undoes a standalone selection change', () => {
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }

    const selectionBefore = JSON.parse(JSON.stringify(editor.selection))
    const selectionAfter = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }

    Transforms.select(editor, selectionAfter)

    assert.equal(editor.history.undos.length, 1)

    editor.undo()

    assert.deepEqual(editor.selection, selectionBefore)

    editor.redo()

    assert.deepEqual(editor.selection, selectionAfter)
  })

  it('undoes a selection change and immediate text insert in one step', () => {
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }

    const selectionBefore = JSON.parse(JSON.stringify(editor.selection))

    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    })
    Transforms.insertText(editor, 'X')

    assert.equal(editor.history.undos.length, 1)

    editor.undo()

    assert.deepEqual(editor.children, [
      { type: 'paragraph', children: [{ text: 'one' }] },
    ])
    assert.deepEqual(editor.selection, selectionBefore)
  })

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

  it('restores a deselection that happens before the pending flush', async () => {
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }

    Transforms.insertText(editor, 'X')
    Transforms.deselect(editor)

    await flushMicrotasks()

    editor.undo()
    editor.redo()

    assert.equal(editor.selection, null)
  })

  it('restores a serialized selection-only history batch', () => {
    const selectionBefore = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }
    const selectionAfter = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = selectionBefore

    Transforms.select(editor, selectionAfter)

    const snapshot = JSON.parse(JSON.stringify(editor.history))
    const restored = withHistory(createEditor())

    restored.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    restored.selection = selectionAfter
    restored.history = snapshot

    restored.undo()

    assert.deepEqual(restored.selection, selectionBefore)

    restored.redo()

    assert.deepEqual(restored.selection, selectionAfter)
  })
})
