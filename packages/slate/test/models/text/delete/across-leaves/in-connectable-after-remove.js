/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Cat is</b>very <i>very Cute</i>
  </text>
)

export default function(t) {
  return t.removeText(6, 9)
}

export const output = (
  <text>
    <b>Cat is</b>
    <i> Cute</i>
  </text>
)
