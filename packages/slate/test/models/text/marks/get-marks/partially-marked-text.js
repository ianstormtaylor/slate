/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = (
  <text>
    <i>Cat</i>
    is
    <i>Cute</i>
  </text>
)

export default function(t) {
  return t.getMarks()
}

export const output = Set.of(Mark.create('italic'))
