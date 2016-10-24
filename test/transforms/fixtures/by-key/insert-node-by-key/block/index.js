
import { Block } from '../../../../../..'

export default function (state) {
  const { document, selection } = state

  return state
    .transform()
    .insertNodeByKey(document.key, 0, Block.create({ type: 'paragraph' }))
    .apply()
}
