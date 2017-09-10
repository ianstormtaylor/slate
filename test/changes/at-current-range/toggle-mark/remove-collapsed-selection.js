/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 4,
    focusKey: first.key,
    focusOffset: 4
  })

  change
    .select(range)
    .toggleMark('bold')
    .toggleMark('bold')
    .insertText('s')

  assert.deepEqual(next.selection.toJS(), range.move(1).toJS())
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
      <paragraph>words</paragraph>
    </document>
  </state>
)
