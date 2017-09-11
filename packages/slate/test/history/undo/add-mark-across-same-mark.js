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
        <b>w<anchor />o</b>r<focus />d
      </paragraph>
    </document>
  </state>
)

export const output = input
