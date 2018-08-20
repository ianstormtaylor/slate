/** @jsx h */

import assert from 'assert'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>Cat</paragraph>
      <paragraph>
        <text>
          <anchor />Cat<focus /> is Cute
        </text>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const { selection: { anchor, focus }, anchorBlock } = value
  assert(anchor.isBetweenInNode(anchorBlock, 3, 4), true)
  assert(focus.isBetweenInNode(anchorBlock, 0, 5), false)
}
