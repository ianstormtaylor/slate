/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragmentByPath(
    [0],
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)
