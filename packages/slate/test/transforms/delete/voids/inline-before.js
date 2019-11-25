/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      <text>
        <cursor />
      </text>
      <inline void>
        <text />
      </inline>
      <text />
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
