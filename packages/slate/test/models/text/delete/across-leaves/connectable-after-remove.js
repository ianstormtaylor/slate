/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Cat is</b>very <b>very Cute</b>
  </text>
)

export default function(t) {
  return t.removeText(6, 9)
}

export const output = (
  <text>
    <b>Cat is Cute</b>
  </text>
)
