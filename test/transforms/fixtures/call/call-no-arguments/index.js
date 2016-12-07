
import { Block } from '../../../../..'

export default function (state) {
  const { document, selection } = state

  function insertCustomBlock(transform, blockType) {
    transform.insertBlock('turkey')
  }

  return state
    .transform()
    .call(insertCustomBlock)
    .apply()
}
