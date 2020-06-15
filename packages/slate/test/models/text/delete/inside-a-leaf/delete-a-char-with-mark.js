/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Cat </b>is <i>Cute</i>
  </text>
)

export default function(t) {
  return t.removeText(4, 1)
}

export const output = (
  <text>
    <b>Cat </b>s <i>Cute</i>
  </text>
)
