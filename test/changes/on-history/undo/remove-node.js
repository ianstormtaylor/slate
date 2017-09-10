/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .removeNodeByKey('key1')

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <x-paragraph>The</x-paragraph>
      <x-paragraph>text</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>The</x-paragraph>
      <x-paragraph>text</x-paragraph>
    </document>
  </state>
)
