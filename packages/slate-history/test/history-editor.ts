import assert from 'assert'
import { createEditor } from 'slate'
import { HistoryEditor, withHistory } from '..'

const boom = () => {
  throw new Error('boom')
}

describe('HistoryEditor', () => {
  describe('withMerging', () => {
    it('restores the merging flag when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withMerging(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isMerging(editor), undefined)
    })
  })

  describe('withNewBatch', () => {
    it('restores the merging and splitting flags when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withNewBatch(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isMerging(editor), undefined)
      assert.strictEqual(HistoryEditor.isSplittingOnce(editor), undefined)
    })
  })

  describe('withoutMerging', () => {
    it('restores the merging flag when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withoutMerging(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isMerging(editor), undefined)
    })
  })

  describe('withoutSaving', () => {
    it('restores the saving flag when fn throws', () => {
      const editor = withHistory(createEditor())
      assert.throws(() => HistoryEditor.withoutSaving(editor, boom), /boom/)
      assert.strictEqual(HistoryEditor.isSaving(editor), undefined)
    })
  })
})
