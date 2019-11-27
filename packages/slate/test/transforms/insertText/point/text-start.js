/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'x', { at: { path: [0, 0], offset: 0 } })
}

export const input = (
  <editor>
    <block>
      <text>
        wo
        <cursor />
        rd
      </text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      xwo
      <cursor />
      rd
    </block>
  </editor>
)
