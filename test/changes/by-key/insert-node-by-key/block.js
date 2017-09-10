/** @jsx h */

import h from '../../../helpers/h'
import { Block } from '../../../..'

export default function (change) {
  change.insertNodeByKey('a', 0, Block.create('paragraph'))
}

export const input = (
  <state>
    <document key="a">
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph />
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)
