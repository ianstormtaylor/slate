
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fourth.key,
    focusOffset: 2
  })

  const next = state
    .transform()
    .select(range)
    .wrapInline('hashtag')
    .apply()

  const three = next.document.getTexts().get(2)
  const seven = next.document.getTexts().get(6)

  // TODO: seems wrong.
  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: three.key,
      anchorOffset: 0,
      focusKey: seven.key,
      focusOffset: seven.length
    }).toJS()
  )

  return next
}
