
import { Mark } from '../../../../..'
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.length,
    focusKey: first.key,
    focusOffset: first.length
  })

  const marks = Mark.createSet([
    Mark.create({
      type: 'bold'
    })
  ])

  const next = state
    .transform()
    .moveTo(range)
    .insertText('a', marks)
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.moveForward().toJS()
  )

  return next
}
