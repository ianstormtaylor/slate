
import { Mark } from '../../../../..'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 1
  })

  return state
    .transform()
    .removeMarkAtRange(range, Mark.create({
      type: 'bold',
      data: { key: 'value' }
    }))
    .apply()
}
