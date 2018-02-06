/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .moveNodeByKey('b', 'a', 1)
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document key="a">
      <paragraph key="b">one</paragraph>
      <paragraph key="c">two</paragraph>
    </document>
  </value>
)

export const output = input
