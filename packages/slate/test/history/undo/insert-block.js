/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .insertBlock('quote')
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph><cursor />one</paragraph>
    </document>
  </state>
)

export const output = input
