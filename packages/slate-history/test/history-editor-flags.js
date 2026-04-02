import assert from 'assert'
import { createEditor, Transforms } from '../../slate/src'
import { HistoryEditor, withHistory } from '../src'

const createSelection = offset => ({
  anchor: { path: [0, 0], offset },
  focus: { path: [0, 0], offset },
})

const createHistoryEditor = () => {
  const editor = withHistory(createEditor())

  editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
  editor.selection = createSelection(3)

  return editor
}

const flushMicrotasks = async () => {
  await Promise.resolve()
}

describe('slate-history helper cleanup', () => {
  it('clears stale undo history after direct children replacement post-flush', async () => {
    const editor = createHistoryEditor()
    const replacement = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]

    Transforms.insertText(editor, '!')
    await flushMicrotasks()

    assert.equal(editor.history.undos.length, 1)

    editor.children = replacement

    assert.equal(editor.history.undos.length, 0)
    assert.equal(editor.history.redos.length, 0)

    editor.undo()

    assert.deepEqual(editor.children, replacement)
  })

  it('clears stale undo history after direct children replacement inside withoutSaving', async () => {
    const editor = createHistoryEditor()
    const replacement = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]

    Transforms.insertText(editor, '!')
    await flushMicrotasks()

    assert.equal(editor.history.undos.length, 1)

    HistoryEditor.withoutSaving(editor, () => {
      editor.children = replacement
    })

    assert.equal(editor.history.undos.length, 0)
    assert.equal(editor.history.redos.length, 0)

    editor.undo()

    assert.deepEqual(editor.children, replacement)
  })

  it('clears stale undo history when an inner apply wrapper replaces children', () => {
    const replacement = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]
    const editor = withHistory(createEditor())
    const { apply } = editor

    editor.apply = op => {
      apply(op)

      if (op.type === 'set_node') {
        editor.children = replacement
      }
    }

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

    editor.apply({
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: { id: 'x' },
    })

    assert.equal(editor.history.undos.length, 0)
    assert.equal(editor.history.redos.length, 0)

    editor.undo()

    assert.deepEqual(editor.children, replacement)
  })
})
