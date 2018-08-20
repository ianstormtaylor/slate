/** @jsx h */

import assert from 'assert'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          <anchor />Cat<focus /> is Cute
        </text>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const { selection: { anchor, focus }, anchorText } = value
  assert(anchor.isBetweenInNode(anchorText, 0, 1), true)
  assert(focus.isBetweenInNode(anchorText, 0, 2), false)
}
