/** @jsx h */

import h from '../../../helpers/h'

import { Block } from '../../../../..'

export default function (change) {

  function insertCustomBlock(change, blockType) {
    change.insertBlock('turkey')
  }

  return state
    .change()
    .call(insertCustomBlock)
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
      <x-turkey></x-turkey>
      <x-paragraph>one</x-paragraph>
      <x-paragraph>two</x-paragraph>
    </document>
  </state>
)
