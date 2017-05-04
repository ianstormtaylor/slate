
import { Block } from '../../../../../..'

export default function (state) {
  const testBlock = Block.create({ type: 'paragraph' })

  // TODO: insert 'word' to the last text node in the last paragraph block

  return state
    .transform()
    .insertTextByKey(document.key, 0, 'word')
    .apply()
}
