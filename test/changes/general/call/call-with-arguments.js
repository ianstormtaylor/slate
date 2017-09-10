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
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <crystal></crystal>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)
