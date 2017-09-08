
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const range = selection.merge({
    anchorKey: 'b',
    anchorOffset: 4,
    focusKey: 'b',
    focusOffset: 5
  })

  const next = state
    .change()
    .select(range)
    .splitNodeByKey('b', 3, { normalize: false })
    .state

  // The second text
  const second = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: second.key,
      anchorOffset: 1,
      focusKey: second.key,
      focusOffset: 2
    }).toJS()
  )

  return next
}
