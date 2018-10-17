/** @jsx h */

import h from '../../../../helpers/h'
import { Set } from 'immutable'

export const input = (
  <text>
    <i>Cat</i>
    is
    <i>Cute</i>
  </text>
)

export default function(t) {
  return t.getActiveMarks()
}

export const output = Set()
