/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection, document } = state
  const dest = document.getDescendant('key2')

  change
    // Make a dummy change to the doc, so that the selection operation can be
    // undone
    .setNodeByKey(document.nodes.first().key, { data: { any: 'thing' }})
    .select(selection.moveToRangeOf(dest))

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <paragraph>The</paragraph>
      <paragraph>text</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>The</paragraph>
      <paragraph>text</paragraph>
    </document>
  </state>
)
