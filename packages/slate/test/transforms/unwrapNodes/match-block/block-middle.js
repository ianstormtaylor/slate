/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' } })
}

export const input = (
  <editor>
    <block key="a">
      <block>one</block>
      <block>two</block>
      <block>
        <anchor />
        three
      </block>
      <block>
        <focus />
        four
      </block>
      <block>five</block>
      <block>six</block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>one</block>
    <block>two</block>
    <block>
      <anchor />
      three
    </block>
    <block>
      <focus />
      four
    </block>
    <block>five</block>
    <block>six</block>
  </editor>
)
