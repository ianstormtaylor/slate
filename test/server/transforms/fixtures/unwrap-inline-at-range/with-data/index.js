
import { Data } from '../../../../../..'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 3
  })

  return state
    .transform()
    .unwrapInlineAtRange(range, 'hashtag', Data.create({ key: 'one' }))
    .apply()
}
