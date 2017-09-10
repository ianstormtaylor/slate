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

  // Test selection
  const first = document.getTexts().first()
  const last = document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
        anchorKey: first.key,
        anchorOffset: 1,
        focusKey: last.key,
        focusOffset: 4
    }).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>wo
        <hashtag>rd</hashtag>
      </paragraph>
      <paragraph>
        <hashtag>an</hashtag>other
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </state>
)
