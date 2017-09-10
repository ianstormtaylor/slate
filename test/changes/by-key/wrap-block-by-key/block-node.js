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
      <x-paragraph>
        <x-code>some code</x-code>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-quote>
          <x-code>some code</x-code>
        </x-quote>
      </x-paragraph>
    </document>
  </state>
)
