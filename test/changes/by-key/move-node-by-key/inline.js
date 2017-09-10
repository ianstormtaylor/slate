/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const block = document.getBlocks().first()
  const first = document.getInlines().first()

  return state
    .change()
    .moveNodeByKey(first.key, block.key, 3)
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>one</x-link>
        <x-link>two</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-link>two</x-link>
        <x-link>one</x-link>
      </x-paragraph>
    </document>
  </state>
)
