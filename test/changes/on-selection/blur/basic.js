/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { startText, selection } = state

  change
    .focus()
    .blur()

  assert.deepEqual(
    next.selection.toJS(),
    selection.toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </state>
)
