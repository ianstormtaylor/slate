/** @jsx h */

import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = (
  <text>
    Cat<b> is Cute</b>
  </text>
)[0]

export default function(t) {
  return t.addMark(3, 4, Mark.create('bold'))
}

export const output = (
  <text>
    Cat<b> is Cute</b>
  </text>
)[0]
