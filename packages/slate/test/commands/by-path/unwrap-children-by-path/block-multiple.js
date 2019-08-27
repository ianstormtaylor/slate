/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapChildrenByPath([0])
}

export const input = (
  <value>
    <document>
      <quote key="a">
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
