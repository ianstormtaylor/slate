/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapChildrenByKey('a')
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
