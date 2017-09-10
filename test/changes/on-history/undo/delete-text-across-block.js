/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'a',
    anchorOffset: 1,
    focusKey: 'b',
    focusOffset: 3
  })

  const first = state
    .change()
    .deleteAtRange(range)

  const next = first
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
