/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .removeMark('bold')
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <b>one</b>
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = input
