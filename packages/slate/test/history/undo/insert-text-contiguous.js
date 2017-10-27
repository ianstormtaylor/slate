/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .insertText('t')
    .value
    .change()
    .insertText('w')
    .value
    .change()
    .insertText('o')
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <paragraph>one<cursor /></paragraph>
    </document>
  </value>
)

export const output = input
