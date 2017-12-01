/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .addMark('bold')
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <paragraph>
        <i>w<anchor />o</i>r<focus />d
      </paragraph>
    </document>
  </value>
)

export const output = input
