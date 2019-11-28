/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' }, split: true })
}

export const input = (
  <editor>
    <block key="a">
      <block>
        <anchor />
        one
      </block>
      <block>two</block>
      <block>three</block>
      <block>four</block>
      <block>five</block>
      <block>
        six
        <focus />
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <anchor />
      one
    </block>
    <block>two</block>
    <block>three</block>
    <block>four</block>
    <block>five</block>
    <block>
      six
      <focus />
    </block>
  </editor>
)
