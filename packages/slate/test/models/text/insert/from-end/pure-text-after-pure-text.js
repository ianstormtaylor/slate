/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    Cat<b> Cute</b>
  </text>
)

export default function(t) {
  return t.insertText(3, ' is')
}

export const output = (
  <text>
    Cat is<b> Cute</b>
  </text>
)
