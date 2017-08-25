
import assert from 'assert'
import { Block } from '../../../../../..'

export default function (state) {
  const { selection } = state

  let next = state
    .change()
    .insertNodeByKey('key1', 0, Block.create({ type: 'default' }))
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
