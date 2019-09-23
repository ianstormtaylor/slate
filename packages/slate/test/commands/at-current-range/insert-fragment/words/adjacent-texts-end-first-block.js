/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>
        <text>{'one '}</text>
        <text>two</text>
      </paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        {'word '}
        <cursor />
      </paragraph>
      <paragraph>another</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word one two<cursor />
      </paragraph>
      <paragraph>another</paragraph>
    </document>
  </value>
)
