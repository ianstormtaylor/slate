
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .moveTo({
    })
    .addMark('bold')
    .insertText('a')
    .removeMark('bold')
    .insertText('b')
    .apply()

  assert.deepEqual(next.selection.toJS(), range.moveForward().moveForward().toJS())

  return next
}
