/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.liftNodes(editor)
}

export const input = (
  <value>
    <block>
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
  </value>
)

export const output = (
  <value>
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
  </value>
)
