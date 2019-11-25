/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Editor.select(editor, {
    path: [0, 0],
    offset: 1,
  })
}

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<cursor />
      ne
    </block>
  </value>
)
