/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'
import { Mark } from 'slate'

export const input = (
  <text>
    <b x={1}>Cat</b>
    <i x={1}> is</i>
    <b x={2}>Cat</b>
    <i x={2}> is</i>
    <b x={3}>Cat</b>
    <i> is</i>
    <b>Cat</b>
    <i> is</i>
    <b>Cat</b>
  </text>
)

export default function(t) {
  return t.getMarksBetweenOffsets(0, 12)
}

export const output = Set.of(
  Mark.create({ type: 'bold', data: { x: 1 } }),
  Mark.create({ type: 'italic', data: { x: 1 } }),
  Mark.create({ type: 'bold', data: { x: 2 } }),
  Mark.create({ type: 'italic', data: { x: 2 } })
)
