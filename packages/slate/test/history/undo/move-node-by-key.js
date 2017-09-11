/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .moveNodeByKey('b', 'a', 1)
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document key="a">
      <paragraph key="b">one</paragraph>
      <paragraph key="c">two</paragraph>
    </document>
  </state>
)

export const output = input
