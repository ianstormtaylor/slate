
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const t1 = state
    .transform()
    .moveNodeByKey('d', 'a', 0)

  const s1 = t1
    .state

  const t2 = s1
    .transform()
    .undo()

  const next = t2
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
