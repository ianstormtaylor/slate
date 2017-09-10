/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .unwrapNodeByKey('to-unwrap')

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>word1</x-paragraph>
        <x-paragraph>word2</x-paragraph>
        <x-paragraph>word3</x-paragraph>
      </x-quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-quote>
        <x-paragraph>word1</x-paragraph>
        <x-paragraph>word2</x-paragraph>
        <x-paragraph>word3</x-paragraph>
      </x-quote>
    </document>
  </state>
)
