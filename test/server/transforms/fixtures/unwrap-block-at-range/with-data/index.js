
import { Data } from '../../../../../..'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  return state
    .transform()
    .wrapBlockAtRange(range, 'quote', Data.create({ key: 'value' }))
    .apply()
}
