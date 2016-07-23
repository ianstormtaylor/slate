
import { Mark } from '../../../../..'

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

  return state
    .transform()
    .insertTextAtRange(range, 'a', marks)
    .apply()
}
