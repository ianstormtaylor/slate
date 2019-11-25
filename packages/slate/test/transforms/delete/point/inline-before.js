/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
    <block>
      <text />
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
      word
      <cursor />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
