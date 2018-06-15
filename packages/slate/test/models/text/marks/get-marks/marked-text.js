/** @jsx h */

import h from '../../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from '../../../../../src'

export const input = (
  <text>
    <i>Cat </i>
    is
    <b> Cute</b>
  </text>
)[0]

export default function(t) {
  return t.getMarks()
}

export const output = Set.of(Mark.create('italic'), Mark.create('bold'))
