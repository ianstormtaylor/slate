/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .delete()
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <paragraph>
        o<anchor />ne
      </paragraph>
      <paragraph>
        tw<focus />o
      </paragraph>
    </document>
  </value>
)

export const output = input
