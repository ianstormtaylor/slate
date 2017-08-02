
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const range = selection.merge({
    anchorKey: 'b',
    anchorOffset: 0,
    focusKey: 'b',
    focusOffset: 3
  })

  const next = state
    .transform()
    .select(range)
    .splitDescendantsByKey('a', 'b', 2)
    .apply()


  const second = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: second.key,
      focusOffset: 1
    }).toJS()
  )

  return next
}
