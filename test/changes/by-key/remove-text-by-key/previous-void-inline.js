/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const third = document.getTexts().get(2)

  return state
    .change()
    .removeTextByKey(third.key, 0, 1)
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-image></x-image>a
        <x-link>two</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-image></x-image>
        <x-link>two</x-link>
      </x-paragraph>
    </document>
  </state>
)
