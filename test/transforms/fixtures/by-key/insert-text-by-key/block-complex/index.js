// Import { Block } from '../../../../../..'

export default function (state) {
  const { document } = state

  const lastBlock = document.getBlocks().last()

  return state
    .transform()
    .insertTextByKey(lastBlock.key, 11, 'word')
    .apply()
}
