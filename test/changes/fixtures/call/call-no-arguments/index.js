
import { Block } from '../../../../..'

export default function (state) {
  const { document, selection } = state

  function insertCustomBlock(change, blockType) {
    change.insertBlock('turkey')
  }

  return state
    .change()
    .call(insertCustomBlock)
    .state
}
