/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.nodes.get(0)

  return state
    .change()
    .setNodeByKey(first.key, 'code')
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
      <x-code>word</x-code>
    </document>
  </state>
)
