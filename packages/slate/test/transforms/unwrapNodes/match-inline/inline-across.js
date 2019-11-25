/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      <text />
      <inline key="a">
        <anchor />
        one
      </inline>
      two
      <inline key="a">
        three
        <focus />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />
      onetwothree
      <focus />
    </block>
  </value>
)
