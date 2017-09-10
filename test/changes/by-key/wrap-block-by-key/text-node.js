/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .wrapBlockByKey('key', 'quote')
}

export const input = (
  <state>
    <document>
      <x-paragraph>some</x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-quote>some</x-quote>
      </x-paragraph>
    </document>
  </state>
)
