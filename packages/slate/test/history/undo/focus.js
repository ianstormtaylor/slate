/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .focus()
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
).blur()

export const output = input
