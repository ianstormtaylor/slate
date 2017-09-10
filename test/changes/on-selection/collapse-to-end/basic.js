/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)

  change
    .select({
      anchorKey: second.key,
      anchorOffset: 0,
      focusKey: second.key,
      focusOffset: second.text.length
    })
    .collapseToEnd()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: second.key,
    anchorOffset: second.text.length,
    focusKey: second.key,
    focusOffset: second.text.length,
    isBackward: false,
    isFocused: false,
    marks: null,
  })
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  </state>
)
