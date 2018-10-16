/** @jsx h */

import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = <text>Cat is Cute</text>

export default function(t) {
  return t.addMark(0, t.text.length, Mark.create('italic'))
}

export const output = (
  <text>
    <i>Cat is Cute</i>
  </text>
)
