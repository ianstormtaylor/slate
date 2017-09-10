/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { startText, selection } = state
  const sel = selection.merge({
    isFocused: true
  })

  change
    .focus()

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
