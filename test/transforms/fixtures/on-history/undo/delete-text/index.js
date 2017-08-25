
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  const next = state
    .transform()
    .select(range)
    .delete()
    .state

    .transform()
    .undo()
    .state

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({ anchorOffset: 4 }).toJS(),
  )

  return next
}
