/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)

  change
    .collapseToAnchor()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
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
