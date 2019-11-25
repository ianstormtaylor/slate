/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>one</block>
    <block>
      <text>
        t<cursor />
        wo
      </text>
    </block>
  </value>
)

export const run = editor => {
  Editor.delete(editor, { at: [1, 0] })
}

export const output = (
  <value>
    <block>
      one
      <cursor />
    </block>
    <block>
      <text />
    </block>
  </value>
)
