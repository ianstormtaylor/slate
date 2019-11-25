/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' }, split: true })
}

export const input = (
  <value>
    <block key="a">
      <block>one</block>
      <block>two</block>
      <block>
        <anchor />
        three
      </block>
      <block>
        four
        <focus />
      </block>
      <block>five</block>
      <block>six</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block key="a">
      <block>one</block>
      <block>two</block>
    </block>
    <block>
      <anchor />
      three
    </block>
    <block>
      four
      <focus />
    </block>
    <block key="a">
      <block>five</block>
      <block>six</block>
    </block>
  </value>
)
