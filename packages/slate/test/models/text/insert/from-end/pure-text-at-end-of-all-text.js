/** @jsx h */

import h from '../../../../helpers/h'

export const input = (
  <text>
    Cat<b> is</b>
  </text>
)

export default function(t) {
  return t.insertText(6, ' Cute')
}

export const output = (
  <text>
    Cat<b> is</b> Cute
  </text>
)
