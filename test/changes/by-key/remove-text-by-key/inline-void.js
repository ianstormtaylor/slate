/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const last = document.getTexts().last()

  return state
    .change()
    .removeTextByKey(last.key, 0, 4)
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-image></x-image>word
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-image></x-image>
      </x-paragraph>
    </document>
  </state>
)
