/** @jsx h */

import h from '../../../helpers/h'
import { Block } from 'slate'

export default function(change) {
  change.insertNodeByKey('a', 0, Block.create('paragraph'))
}

export const input = (
  <value>
    <document key="a">
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)
