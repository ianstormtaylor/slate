/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: second.key,
    focusOffset: 5
  })

  change
    .select(range)
    .delete()

  const updated = next.document.getTexts().first()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: updated.key,
    anchorOffset: 0,
    focusKey: updated.key,
    focusOffset: 0,
    isBackward: false,
    isFocused: false,
    marks: null
  })
}

export const input = (
  <state>
    <document>
      <x-image></x-image>
      <x-paragraph>some words</x-paragraph>
      <x-paragraph>other words</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>words</x-paragraph>
      <x-paragraph>other words</x-paragraph>
    </document>
  </state>
)
