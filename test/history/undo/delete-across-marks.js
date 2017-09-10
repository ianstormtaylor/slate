/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .delete()
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph>
        <b>on<anchor />e</b><u>tw<focus />o</u>
      </paragraph>
    </document>
  </state>
)

export const output = input
