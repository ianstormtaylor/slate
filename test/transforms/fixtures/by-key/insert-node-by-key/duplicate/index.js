
import assert from 'assert'
import { Block } from '../../../../../..'

export default function (state) {
  const { document, selection } = state
  const first = document.getBlocks().first()
  const next = state
    .transform()
    .insertNodeByKey(document.key, 0, first)
    .apply()

  const one = next.document.getBlocks().first()
  const two = next.document.getBlocks().last()

  assert.equal(one.type, two.type)
  assert.notEqual(one.key, two.key)

  return next
}
