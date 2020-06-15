/** @jsx h */

import { Mark } from 'slate'
import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Cat is Cute</b>
  </text>
)

export default function(t) {
  return t.updateMark(0, 3, Mark.create('bold'), { data: { x: 1 } })
}

export const output = (
  <text>
    <b x={1}>Cat</b>
    <b> is Cute</b>
  </text>
)
