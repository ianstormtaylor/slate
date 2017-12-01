/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .insertText('text')
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = input
