/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>
      <text>
        t<cursor />
        wo
      </text>
    </block>
  </editor>
)

export const run = editor => {
  Editor.delete(editor, { at: [1, 0] })
}

export const output = (
  <editor>
    <block>
      one
      <cursor />
    </block>
    <block>
      <text />
    </block>
  </editor>
)
