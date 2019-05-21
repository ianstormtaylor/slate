/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>
        <text>one</text>
        <inline type="link">Some inline stuff</inline>
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
        Aone<inline type="link">Some inline stuff</inline>two<cursor />B
      </paragraph>
    </document>
  </value>
)
