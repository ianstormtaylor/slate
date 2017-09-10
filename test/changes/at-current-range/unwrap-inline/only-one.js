/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'anchor',
    anchorOffset: 2,
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
      focusOffset: 5
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>he
        <hashtag>ll</hashtag>o w
        <hashtag>or</hashtag>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>he
        <hashtag>ll</hashtag>o word
      </paragraph>
    </document>
  </state>
)
