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
        wo<cursor />rd
      </paragraph>
    </document>
  </state>
)

export const output = input
