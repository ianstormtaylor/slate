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
      <quote>
        <paragraph>w
          <hashtag>or</hashtag>d
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </state>
)
