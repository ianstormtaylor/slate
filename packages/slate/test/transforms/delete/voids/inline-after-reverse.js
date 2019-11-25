/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { reverse: true })
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text>
        <cursor />
      </text>
    </block>
  </value>
)
