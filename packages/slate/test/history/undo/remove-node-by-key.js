/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .removeNodeByKey('a')
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document>
      <paragraph>zero</paragraph>
      <paragraph key="a">
        one <cursor />
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = input
