/** @jsx h */

import h from '../../../../helpers/h'
import { Set } from 'immutable'

export const input = <text />[0]

export default function(t) {
  return t.getMarks()
}

export const output = Set()
