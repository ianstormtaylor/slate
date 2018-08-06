/** @jsx h */

import { Mark } from 'slate'
import h from '../../../../helpers/h'

export const input = <b />[0]

export default function(t) {
  return t.updateMark(0, 1, Mark.create('bold'), { data: { x: 1 } })
}

export const output = input
