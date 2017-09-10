/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 3,
    focusKey: first.key,
    focusOffset: 1,
    isBackward: true
  })

  change
    .select(range)
    .wrapText('[[', ']]')


  const updated = next.document.getTexts().get(0)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: 5,
      focusKey: updated.key,
      focusOffset: 3
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
      <paragraph>w[[or]]d</paragraph>
    </document>
  </state>
)
