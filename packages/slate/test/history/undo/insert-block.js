/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .insertBlock('quote')
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <paragraph><cursor />one</paragraph>
    </document>
  </value>
)

export const output = input
