/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 1
  })

  change
    .select(range)
    .toggleMark({
      type: 'bold',
      data: { thing: 'value' }
    })

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
      <paragraph>
        <b>w</b>ord
      </paragraph>
    </document>
  </state>
)
