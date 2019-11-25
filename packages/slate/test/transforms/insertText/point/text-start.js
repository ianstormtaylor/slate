/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'x', { at: { path: [0, 0], offset: 0 } })
}

export const input = (
  <value>
    <block>
      <text>
        wo
        <cursor />
        rd
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      xwo
      <cursor />
      rd
    </block>
  </value>
)
