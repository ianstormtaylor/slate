/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapNodeByPath([0, 1])
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph key="a">two</paragraph>
        <paragraph>three</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
      <paragraph>two</paragraph>
      <quote>
        <paragraph>three</paragraph>
      </quote>
    </document>
  </value>
)
