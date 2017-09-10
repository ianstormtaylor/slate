/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'b',
    anchorOffset: 0,
    focusKey: 'b',
    focusOffset: 4
  })

  change
    .select(range)
    .wrapInline('hashtag')

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: '4',
      anchorOffset: 0,
      focusKey: '3',
      focusOffset: 0
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <hashtag>word</hashtag>
      </paragraph>
    </document>
  </state>
)
