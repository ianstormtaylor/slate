/** @jsx h */

import h from '../../../../helpers/h'

export const input = {
  a: (
    <text>
      <b />
    </text>
  ),
  b: <text>Some</text>,
}

export default function({ a, b }) {
  return a.mergeText(b)
}

export const output = <text>Some</text>
