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
      <block>three</block>
      <block>four</block>
      <block>
        <anchor />
        five
      </block>
      <block>
        six
        <focus />
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block key="a">
      <block>one</block>
      <block>two</block>
      <block>three</block>
      <block>four</block>
    </block>
    <block>
      <anchor />
      five
    </block>
    <block>
      six
      <focus />
    </block>
  </value>
)
