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
