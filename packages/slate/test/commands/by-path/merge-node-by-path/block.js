/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.mergeNodeByPath([1])
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>onetwo</paragraph>
    </document>
  </value>
)
