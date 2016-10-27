
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const range = selection.merge({
    anchorKey: 'anchor',
    anchorOffset: 4,
    focusKey: 'anchor',
    focusOffset: 5
  })

  const next = state
    .transform()
    .moveTo(range)
    .splitNodeByKey('anchor', 3, { normalize: false })
    .apply()

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
