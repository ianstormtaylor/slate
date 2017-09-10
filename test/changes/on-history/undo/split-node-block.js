/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  let next = state
    .change()
    .splitNodeByKey('key1', 3)

  next = next
    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <paragraph>Thetext</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>Thetext</paragraph>
    </document>
  </state>
)
