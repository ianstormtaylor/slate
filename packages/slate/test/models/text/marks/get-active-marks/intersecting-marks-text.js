/** @jsx h */

import h from '../../../../helpers/h'
import { Set } from 'immutable'
import Mark from '../../../../../src/models/mark'

export const input = (
  <text>
    <u>
      <i>
        <b>b</b>
      </i>
    </u>
    <u>
      <i>u</i>
    </u>
    <i>g</i>
  </text>
)

export default function(t) {
  return t.getActiveMarks()
}

export const output = Set.of(Mark.create('italic'))
