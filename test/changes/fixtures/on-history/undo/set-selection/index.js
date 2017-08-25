
import assert from 'assert'

export default function (state) {
  const { selection, document } = state
  const dest = document.getDescendant('key2')

  const next = state
    .change()
    // Make a dummy change to the doc, so that the selection operation can be
    // undone
    .setNodeByKey(document.nodes.first().key, { data: { any: 'thing' }})
    .select(selection.moveToRangeOf(dest))
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
