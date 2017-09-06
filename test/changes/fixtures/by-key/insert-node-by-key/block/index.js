
import { Block } from '../../../../../..'

export default function (state) {
  const { document } = state

  return state
    .change()
    .insertNodeByKey(document.key, 0, Block.create({ type: 'paragraph' }))
    .state
}
