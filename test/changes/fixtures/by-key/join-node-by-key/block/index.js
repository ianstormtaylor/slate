
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const range = selection.merge({
    anchorKey: 'b',
    anchorOffset: 1,
    focusKey: 'd',
    focusOffset: 2
  })

  const next = state
    .change()
    .select(range)
    .mergeNodeByKey('c')
    .state

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: 'b',
      focusOffset: 5
    }).toJS()
  )

  return next
}
