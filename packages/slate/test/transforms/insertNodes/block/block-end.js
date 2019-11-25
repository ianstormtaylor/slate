/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
  </value>
)

export const run = editor => {
  Editor.insertNodes(
    editor,
    <block>
      <text />
    </block>
  )
}

export const output = (
  <value>
    <block>word</block>
    <block>
      <cursor />
    </block>
  </value>
)
