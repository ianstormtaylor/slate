/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.text.length,
    focusKey: third.key,
    focusOffset: 0
  })

  return state
    .change()
    .deleteAtRange(range)
}

export const input = (
  <state>
    <document>
      <x-list>
        <x-item>one</x-item>
        <x-item>two</x-item>
      </x-list>
      <x-list>
        <x-item>three</x-item>
        <x-item>four</x-item>
      </x-list>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-list>
        <x-item>one</x-item>
        <x-item>twothree</x-item>
      </x-list>
      <x-list>
        <x-item>four</x-item>
      </x-list>
    </document>
  </state>
)
