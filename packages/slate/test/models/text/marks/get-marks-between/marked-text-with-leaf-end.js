/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = (
  <text>
    <b>Cat</b>
    <i> is</i> Cute
  </text>
)

export default function(t) {
  return t.getMarksBetweenOffsets(0, 6)
}

export const output = Set.of(Mark.create('bold'), Mark.create('italic'))
