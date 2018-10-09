/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>
      Cat is <i>Cute</i>
    </b>
  </text>
)

export default function(t) {
  return t.removeText(0, t.text.length)
}

export const output = (
  <text>
    <b />
  </text>
)
