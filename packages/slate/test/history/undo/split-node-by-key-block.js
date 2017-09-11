/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .splitNodeByKey('a', 2)
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph key="a">
        <link>one</link><cursor /><link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = input
