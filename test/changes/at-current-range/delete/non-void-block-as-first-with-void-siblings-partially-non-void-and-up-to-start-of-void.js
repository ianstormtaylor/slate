/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 4,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  const updated = next.document.getTexts().first()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: updated.key,
    anchorOffset: updated.text.length,
    focusKey: updated.key,
    focusOffset: updated.text.length,
    isBackward: false,
    isFocused: false,
    marks: null
  })
}

export const input = (
  <state>
    <document>
      <paragraph>one two</paragraph>
      <image></image>
      <paragraph>three</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one </paragraph>
      <paragraph>three</paragraph>
    </document>
  </state>
)
