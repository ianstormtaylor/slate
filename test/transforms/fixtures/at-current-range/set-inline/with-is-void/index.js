
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
    .setInline({
      type: 'emoji',
      isVoid: true
    })
    .apply()

  const updated = next.document.getTexts().get(0)

  // TODO: this seems wrong.
  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: 0,
      focusKey: updated.key,
      focusOffset: 0
    }).toJS()
  )

  return next
}
