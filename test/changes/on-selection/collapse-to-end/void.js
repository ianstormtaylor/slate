/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)

  change
    .select({
      anchorKey: first.key,
      anchorOffset: 0,
      focusKey: first.key,
      focusOffset: 1
    })
    .collapseToEnd()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 1,
    isBackward: false,
    isFocused: false,
    marks: null,
  })
}

export const input = (
  <state>
    <document>
      <image></image>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image></image>
    </document>
  </state>
)
