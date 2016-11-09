
import assert from 'assert'
import { Block } from '../../../../../..'

export default function (state) {
  const { selection } = state

  let next = state
    .transform()
    .insertNodeByKey('key1', 0, Block.create({ type: 'default' }))
    .apply()

    .transform()
    .undo()
    .apply()

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
