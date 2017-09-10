/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length - 1,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  change
    .select(range)
    .addMark('bold')

  assert.deepEqual(next.selection.toJS(), range.toJS())
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
      <paragraph>wor
        <b>d</b>
      </paragraph>
    </document>
  </state>
)
