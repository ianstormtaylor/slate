/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change
    .splitNodeByKey('a', 0)
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
      <x-paragraph></x-paragraph>
      <x-paragraph>word</x-paragraph>
    </document>
  </state>
)
