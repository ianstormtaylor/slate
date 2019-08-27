/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceNodeByPath([1, 0], { object: 'text', text: 'three' })
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
      <paragraph>one</paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)
