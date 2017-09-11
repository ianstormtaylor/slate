/** @jsx h */

import { h } from 'slate-core-test-helpers'

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
        <link>o<anchor />ne</link>
      </paragraph>
      <paragraph>
        <link>tw<focus />o</link>
      </paragraph>
    </document>
  </state>
)

export const output = input
