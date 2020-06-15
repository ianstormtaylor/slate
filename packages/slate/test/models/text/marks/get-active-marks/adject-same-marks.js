/** @jsx h */

import h from '../../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from 'slate'

export const input = (
  <text>
    <b>
      <i>Cat is </i>
      <i>Cute</i>
    </b>
  </text>
)

export default function(t) {
  return t.getActiveMarks()
}

export const output = Set.of(Mark.create('italic'), Mark.create('bold'))
