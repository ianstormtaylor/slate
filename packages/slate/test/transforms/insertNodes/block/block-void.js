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
  <editor>
    <block void>
      text
      <cursor />
    </block>
    <block>text</block>
  </editor>
)

export const output = (
  <editor>
    <block void>text</block>
    <block>
      <cursor />
    </block>
    <block>text</block>
  </editor>
)
