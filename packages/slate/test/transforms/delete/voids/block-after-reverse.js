/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { reverse: true })
}

export const input = (
  <editor>
    <block void>
      <text />
    </block>
    <block>
      <cursor />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <cursor />
    </block>
  </editor>
)
