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
    <block void>
      text
      <cursor />
    </block>
    <block>text</block>
  </value>
)

export const output = (
  <value>
    <block void>text</block>
    <block>
      <cursor />
    </block>
    <block>text</block>
  </value>
)
