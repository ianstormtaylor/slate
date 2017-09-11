/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .addMark('bold')
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph>
        o<anchor />ne
      </paragraph>
      <paragraph>
        tw<focus />o
      </paragraph>
    </document>
  </state>
)

export const output = input
