/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <value>
    <block>
      on
      <anchor />e
    </block>
    <block void>two</block>
    <block>
      th
      <focus />
      ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>on</block>
    <block>
      <cursor />
      ree
    </block>
  </value>
)
