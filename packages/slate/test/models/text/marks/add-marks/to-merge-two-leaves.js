/** @jsx h */

import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = (
  <text>
    Cat is
    <b> Cute</b>
  </text>
)

export default function(t) {
  return t.addMark(3, 3, Mark.create('bold'))
}

export const output = (
  <text>
    Cat<b> is Cute</b>
  </text>
)
