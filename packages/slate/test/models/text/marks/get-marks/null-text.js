/** @jsx h */

import h from '../../../../helpers/h'
import { Set } from 'immutable'

export const input = <text />

export default function(t) {
  return t.getMarks()
}

export const output = Set()
