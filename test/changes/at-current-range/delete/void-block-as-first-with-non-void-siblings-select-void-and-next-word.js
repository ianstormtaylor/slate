/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 4
  })

  change
    .select(range)
    .delete()

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: second.key,
      anchorOffset: 0,
      focusKey: second.key,
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
      <paragraph>some words</paragraph>
      <paragraph>other words</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph> words</paragraph>
      <paragraph>other words</paragraph>
    </document>
  </state>
)
