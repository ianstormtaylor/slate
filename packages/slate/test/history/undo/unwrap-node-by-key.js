/** @jsx h */

import h from '../../helpers/h'

export default function (state) {
  return state
    .change()
    .unwrapNodeByKey('a')
    .state
    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph key="a">
          <cursor />one
        </paragraph>
        <paragraph>
          two
        </paragraph>
        <paragraph>
          three
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = input
