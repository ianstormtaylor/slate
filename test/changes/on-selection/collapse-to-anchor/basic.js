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
    .collapseToAnchor()

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
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
      <x-paragraph>three</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
      <x-paragraph>three</x-paragraph>
    </document>
  </state>
)
