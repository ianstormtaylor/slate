/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .unwrapNodeByKey('to-unwrap')
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
