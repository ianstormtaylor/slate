
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .change()
    .selectAll(selection)
    .state

  const sel = selection.merge({
    anchorKey: '0',
    anchorOffset: 0,
    focusKey: '4',
    focusOffset: 5,
  })

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
  )
}
