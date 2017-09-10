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
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <turkey></turkey>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)
