/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getBlocks().first()

  return state
    .change()
    .moveNodeByKey(first.key, document.key, 1)
}

export const input = (
  <state>
    <document>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>two</x-paragraph>
      <x-paragraph>one</x-paragraph>
    </document>
  </state>
)
