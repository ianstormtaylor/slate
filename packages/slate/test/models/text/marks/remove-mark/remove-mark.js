/** @jsx h */

import { Mark } from 'slate'
import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Cat is Cute</b>
  </text>
)[0]

export default function(t) {
  return t.removeMark(0, 3, Mark.create('bold'))
}

export const output = (
  <text>
    Cat<b> is Cute</b>
  </text>
)[0]
