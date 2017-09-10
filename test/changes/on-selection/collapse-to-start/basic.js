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
    .collapseToStart()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0,
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
