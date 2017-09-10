/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const text = document.getTexts().last()
  const block = document.getBlocks().first()

  return state
    .change()
    .moveNodeByKey(text.key, block.key, 1)
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
      <x-paragraph>onetwo</x-paragraph>
      <x-paragraph></x-paragraph>
    </document>
  </state>
)
