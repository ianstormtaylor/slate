/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Catt</b> is <i>Cute</i>
  </text>
)[0]

export default function(t) {
  return t.removeText(3, 1)
}

export const output = (
  <text>
    <b>Cat</b> is <i>Cute</i>
  </text>
)[0]
