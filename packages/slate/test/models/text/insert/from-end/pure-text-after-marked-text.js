/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <i>Cat</i>
    <b> Cute</b>
  </text>
)

export default function(t) {
  return t.insertText(3, ' is')
}

export const output = (
  <text>
    <i>Cat</i> is<b> Cute</b>
  </text>
)
