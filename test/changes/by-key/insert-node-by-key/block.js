/** @jsx h */

import h from '../../../helpers/h'

import { Block } from '../../../..'

export default function (change) {

  return state
    .change()
    .insertNodeByKey(document.key, 0, Block.create({ type: 'paragraph' }))
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
      <paragraph></paragraph>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)
