
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  const next = state
    .change()
    .select(range)
    .deleteForward()
    .state

  const updated = next.document.getTexts().first()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStartOf(updated).move(first.text.length).toJS()
  )

  return next
}
