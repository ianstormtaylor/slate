/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'anchor',
    anchorOffset: 1,
    focusKey: 'focus',
    focusOffset: 2
  })

  change
    .select(range)
    .unwrapInline('hashtag')

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: 'anchor',
      focusOffset: 3
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>w
        <hashtag>or</hashtag>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
    </document>
  </state>
)
