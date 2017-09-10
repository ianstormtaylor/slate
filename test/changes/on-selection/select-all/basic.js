/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .selectAll(selection)

  const sel = selection.merge({
    anchorKey: '0',
    anchorOffset: 0,
    focusKey: '4',
    focusOffset: 5,
  })

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
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
