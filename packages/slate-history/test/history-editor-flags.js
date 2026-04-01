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
  it('restores merge state when withMerging throws', async () => {
    const editor = createHistoryEditor()

    Transforms.insertText(editor, '!')
    await flushMicrotasks()
    Transforms.select(editor, createSelection(0))

    assert.throws(() => {
      HistoryEditor.withMerging(editor, () => {
        throw new Error('boom')
      })
    }, /boom/)

    assert.equal(HistoryEditor.isMerging(editor), undefined)

    Transforms.insertText(editor, '?')

    assert.equal(editor.history.undos.length, 2)
  })

  it('restores merge and split state when withNewBatch throws', () => {
    const editor = createHistoryEditor()

    Transforms.insertText(editor, '!')

    assert.throws(() => {
      HistoryEditor.withNewBatch(editor, () => {
        throw new Error('boom')
      })
    }, /boom/)

    assert.equal(HistoryEditor.isMerging(editor), undefined)
    assert.equal(HistoryEditor.isSplittingOnce(editor), undefined)

    Transforms.insertText(editor, '?')

    assert.equal(editor.history.undos.length, 1)
  })

  it('consumes the split flag across nested withNewBatch calls', async () => {
    const editor = createHistoryEditor()

    Transforms.insertText(editor, '!')
    await flushMicrotasks()

    HistoryEditor.withNewBatch(editor, () => {
      HistoryEditor.withNewBatch(editor, () => {
        Transforms.insertText(editor, 'x')
      })

      Transforms.insertText(editor, 'y')
    })

    assert.equal(editor.history.undos.length, 2)
    assert.deepEqual(
      editor.history.undos[1].operations.map(op => op.text),
      ['x', 'y']
    )
  })

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

  it('restores merge state when withoutMerging throws', () => {
    const editor = createHistoryEditor()

    Transforms.insertText(editor, '!')

    assert.throws(() => {
      HistoryEditor.withoutMerging(editor, () => {
        throw new Error('boom')
      })
    }, /boom/)

    assert.equal(HistoryEditor.isMerging(editor), undefined)

    Transforms.insertText(editor, '?')

    assert.equal(editor.history.undos.length, 1)
  })
})
