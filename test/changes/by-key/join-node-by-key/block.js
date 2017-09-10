/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  const range = selection.merge({
    anchorKey: 'b',
    anchorOffset: 1,
    focusKey: 'd',
    focusOffset: 2
  })

  change
    .select(range)
    .mergeNodeByKey('c')

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: 'b',
      focusOffset: 5
    }).toJS()
  )
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
      <paragraph>Thetext</paragraph>
    </document>
  </state>
)
