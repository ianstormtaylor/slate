/** @jsx h */

import h from '../../../helpers/h'

import { Block } from '../../../../..'

export default function (change) {

  function insertCustomBlock(change, blockType) {
    change.insertBlock(blockType)
  }

  return state
    .change()
    .call(insertCustomBlock, 'crystal')
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
      <x-crystal></x-crystal>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
    </document>
  </state>
)
