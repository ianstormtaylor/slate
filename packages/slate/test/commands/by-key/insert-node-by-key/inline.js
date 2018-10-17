/** @jsx h */

import h from '../../../helpers/h'
import { Inline } from 'slate'

export default function(change) {
  change.insertNodeByKey('a', 0, Inline.create('emoji'))
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <emoji />
        <cursor />word
      </paragraph>
    </document>
  </value>
)
