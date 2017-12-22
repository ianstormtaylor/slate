/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .wrapInline('hashtag')
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </value>
)

export const output = input
