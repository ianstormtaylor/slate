
import { Block } from '../../../../../..'

export default function (state) {
  const { document, selection } = state

  const testBlock = Block.create({ type: 'paragraph' })

  return state
    .transform()
    .insertBlock(testBlock)
    .insertTextByKey(testBlock.key, 0, 'works!')
    .apply()
}
