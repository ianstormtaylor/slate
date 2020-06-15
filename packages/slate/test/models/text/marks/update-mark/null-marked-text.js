/** @jsx h */

import { Mark } from 'slate'
import h from '../../../../helpers/h'

export const input = (
  <text>
    <b />
  </text>
)

export default function(t) {
  return t.updateMark(0, 0, Mark.create('bold'), { data: { x: 1 } })
}

export const output = (
  <text>
    <b x={1} />
  </text>
)
