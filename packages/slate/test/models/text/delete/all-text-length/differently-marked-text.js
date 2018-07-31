/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>Cat</b> is <i>Cute</i>
  </text>
)[0]

export default function(t) {
  return t.removeText(0, t.text.length)
}

export const output = <text />[0]
