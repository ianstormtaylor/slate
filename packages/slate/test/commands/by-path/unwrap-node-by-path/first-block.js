/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapNodeByPath([0, 0])
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">one</paragraph>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <quote>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)
