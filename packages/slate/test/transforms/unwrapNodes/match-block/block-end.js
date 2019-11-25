/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
      <block>one</block>
      <block>two</block>
      <block>three</block>
      <block>four</block>
      <block>
        <anchor />
        five
      </block>
      <block>
        <focus />
        six
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
    <block>two</block>
    <block>three</block>
    <block>four</block>
    <block>
      <anchor />
      five
    </block>
    <block>
      <focus />
      six
    </block>
  </value>
)
