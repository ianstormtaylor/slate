/** @jsx h */

import h from '../../../helpers/h'

import { Block } from '../../../../../..'

export default function (change) {

  return state
    .change()
    .insertNodeByKey(document.key, 0, Block.create({ type: 'paragraph' }))
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
      <x-paragraph></x-paragraph>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
    </document>
  </state>
)
