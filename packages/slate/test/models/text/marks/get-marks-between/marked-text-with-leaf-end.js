/** @jsx h */

import { Set } from 'immutable'
import h from '../../../../helpers/h'
import { Mark } from '../../../../../src'

export const input = (
  <text>
    <b>Cat</b>
    <i> is</i> Cute
  </text>
)[0]

export default function(t) {
  return t.getMarksBetweenOffsets(0, 6)
}

export const output = Set.of(Mark.create('bold'), Mark.create('italic'))
