import assert from 'assert'
import { createEditor } from '../../slate/src'
import { History, HistoryEditor, withHistory } from '../src'

describe('slate-history guards', () => {
  it('returns false for malformed history batch entries', () => {
    assert.equal(History.isHistory({ redos: [null], undos: [] }), false)
    assert.equal(
      History.isHistory({
        redos: [{ operations: null }],
        undos: [],
      }),
      false
    )
    assert.equal(
      History.isHistory({
        redos: [],
        undos: [{ operations: null }],
      }),
      false
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
})
