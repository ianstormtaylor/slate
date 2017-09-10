/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change
    .splitDescendantsByKey('a', 'b', 2)
}

export const input = (
  <state>
    <document>
      <x-paragraph>word</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>wo</x-paragraph>
      <x-paragraph>rd</x-paragraph>
    </document>
  </state>
)
