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
    focusOffset: 1
  })

  change
    .select(range)
    .delete()

  const anchorAndFocusKey = next.document.getTexts().first()
  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: anchorAndFocusKey.key,
      anchorOffset: anchorAndFocusKey.characters.size,
      focusKey: anchorAndFocusKey.key,
      focusOffset: anchorAndFocusKey.characters.size,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )
}

export const input = (
  <state>
    <document>
      <x-paragraph>one two</x-paragraph>
      <x-image></x-image>
      <x-paragraph>three</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>one </x-paragraph>
      <x-paragraph>three</x-paragraph>
    </document>
  </state>
)
