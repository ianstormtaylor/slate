/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .splitNodeByKey('a', 2)
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <link>one</link>
        <cursor />
        <link>two</link>
      </paragraph>
    </document>
  </value>
)

export const output = input
