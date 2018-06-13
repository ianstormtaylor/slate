/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .addMark('bold')
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />wo<focus />rd
      </paragraph>
    </document>
  </value>
)

export const output = input
