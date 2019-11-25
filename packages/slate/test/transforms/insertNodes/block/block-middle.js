/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertNodes(
    editor,
    <block>
      <text />
    </block>
  )
}

export const input = (
  <value>
    <block>
      wo
      <cursor />
      rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>wo</block>
    <block>
      <cursor />
    </block>
    <block>rd</block>
  </value>
)
