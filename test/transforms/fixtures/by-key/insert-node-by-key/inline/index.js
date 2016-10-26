
import { Inline } from '../../../../../..'

export default function (state) {
  const { document, selection } = state
  const first = document.getBlocks().first()

  return state
    .transform()
    .insertNodeByKey(first.key, 0, Inline.create({
      type: 'image',
      isVoid: true
    }))
    .apply()
}
