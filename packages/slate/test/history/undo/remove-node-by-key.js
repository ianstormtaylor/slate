/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .removeNodeByKey('a')
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        one
      </paragraph>
    </document>
  </value>
)

export const output = input

export const skip = true
