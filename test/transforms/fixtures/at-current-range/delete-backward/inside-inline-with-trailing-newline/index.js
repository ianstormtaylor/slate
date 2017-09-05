
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .moveTo(range)
    .deleteBackward()
    .apply()

  // Not sure what this should look like
  // assert.deepEqual(
  //   next.selection.toJS(),
  //   range.toJS()
  // )

  return next
}
