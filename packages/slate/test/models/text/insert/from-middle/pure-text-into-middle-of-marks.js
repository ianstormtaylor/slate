/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    <b>CatCute</b>
  </text>
)

export default function(t) {
  return t.insertText(3, ' is ')
}

export const output = (
  <text>
    <b>Cat</b> is <b>Cute</b>
  </text>
)
