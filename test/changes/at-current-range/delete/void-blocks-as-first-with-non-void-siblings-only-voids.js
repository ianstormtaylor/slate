/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: third.key,
    focusOffset: 0
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: third.key,
      anchorOffset: 0,
      focusKey: third.key,
      focusOffset: 0,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )
}

export const input = (
  <state>
    <document>
      <image></image>
      <image></image>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)
