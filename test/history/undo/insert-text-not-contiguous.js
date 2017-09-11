/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .insertText('t')
    .state
    .change()
    .move(-1)
    .insertText('w')
    .state
    .change()
    .move(-1)
    .insertText('o')
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph>one<cursor /></paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one<cursor />wt</paragraph>
    </document>
  </state>
)
