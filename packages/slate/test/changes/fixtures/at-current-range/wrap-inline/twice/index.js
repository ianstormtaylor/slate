
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const text = texts.first()
  const range = selection.merge({
    anchorKey: text.key,
    anchorOffset: 7,
    focusKey: text.key,
    focusOffset: 11
  })

  const next = state
    .change()
    .select(range)
    .wrapInline('inner')
    .wrapInline('outer')
    .state

  const anchor = next.document.getTexts().get(2)
  const focus = next.document.getTexts().get(4)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: anchor.key,
      anchorOffset: 0,
      focusKey: focus.key,
      focusOffset: 0
    }).toJS()
  )

  return next
}
