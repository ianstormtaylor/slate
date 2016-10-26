
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const range = selection.merge({
    anchorKey: 'anchor',
    anchorOffset: 2,
    focusKey: 'anchor',
    focusOffset: 5
  })

  const next = state
    .transform()
    .moveTo(range)
    .splitNodeByKey('key', 3)
    .apply()


  const second = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: second.key,
      focusOffset: 2
    }).toJS()
  )

  return next
}
