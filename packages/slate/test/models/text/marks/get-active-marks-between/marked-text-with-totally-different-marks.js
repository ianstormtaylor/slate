/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Cat</b>
    <i> is</i> Cute
  </text>
)

export default function(t) {
  return t.getActiveMarksBetweenOffsets(0, 6)
}

export const output = Set()
