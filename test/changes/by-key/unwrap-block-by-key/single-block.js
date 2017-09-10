/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const block = document.nodes.get(0)

  return state
    .change()
    .unwrapBlockByKey(block.key, 'quote')
}

export const input = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>word</x-paragraph>
      </x-quote>
      <x-quote>
        <x-paragraph>word</x-paragraph>
      </x-quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>word</x-paragraph>
      <x-quote>
        <x-paragraph>word</x-paragraph>
      </x-quote>
    </document>
  </state>
)
