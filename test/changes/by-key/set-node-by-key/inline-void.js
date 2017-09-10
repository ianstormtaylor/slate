/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getInlines().first()

  return state
    .change()
    .setNodeByKey(first.key, {
      type: 'image',
      isVoid: true
    })
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>word</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-image></x-image>
      </x-paragraph>
    </document>
  </state>
)
