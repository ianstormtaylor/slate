/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .insertText('text')
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = input
