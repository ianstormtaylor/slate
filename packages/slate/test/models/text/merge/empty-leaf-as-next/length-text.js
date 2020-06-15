/** @jsx h */

import h from '../../../../helpers/h'

export const input = {
  a: (
    <text>
      <i>Some</i>
    </text>
  ),
  b: <text />,
}

export default function({ a, b }) {
  return a.mergeText(b)
}

export const output = (
  <text>
    <i>Some</i>
  </text>
)
