
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .select(range)
    .setInline({ type: 'code' })
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )

  return next
}
