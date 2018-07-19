/** @jsx h */

import h from '../../../../helpers/h'
import { Mark } from '../../../../..'

export const input = <text>Cat is Cute</text>[0]

export default function(t) {
  return t.addMark(0, t.text.length, Mark.create('italic'))
}

export const output = (
  <text>
    <i>Cat is Cute</i>
  </text>
)[0]
