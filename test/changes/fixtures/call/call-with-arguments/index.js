
import { Block } from '../../../../..'

export default function (state) {
  const { document, selection } = state

  function insertCustomBlock(change, blockType) {
    change.insertBlock(blockType)
  }

  return state
    .change()
    .call(insertCustomBlock, 'crystal')
    .state
}
