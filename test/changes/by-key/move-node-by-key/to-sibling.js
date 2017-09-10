/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getBlocks().first()
  const container = document.nodes.last()

  return state
    .change()
    .moveNodeByKey(first.key, container.key, 1)
}

export const input = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
      <x-container>
        <x-paragraph>two</x-paragraph>
      </x-container>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-container>
        <x-paragraph>two</x-paragraph>
        <x-paragraph>one</x-paragraph>
      </x-container>
    </document>
  </state>
)
