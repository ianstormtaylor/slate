/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>
        <text>one</text>
        <link>Some inline stuff</link>
        <text>two</text>
      </paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        A<cursor />B
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Aone<link>Some inline stuff</link>two<cursor />B
      </paragraph>
    </document>
  </value>
)
