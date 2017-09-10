/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 10,
    focusKey: first.key,
    focusOffset: 10
  })

  change
    .select(range)
    .deleteBackward()

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), range.toJS())
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-b>one</x-b>
        <x-u>two</x-u>
        <x-i>three</x-i>
        <x-b>four</x-b>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-b>one</x-b>
        <x-u>two</x-u>
        <x-i>three</x-i>
        <x-b>four</x-b>
      </x-paragraph>
    </document>
  </state>
)
