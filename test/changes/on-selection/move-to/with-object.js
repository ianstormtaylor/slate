/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { startText, selection } = state
  const props = {
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.text.length,
  }

  const sel = selection.merge(props)
  change
    .select(props)

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
