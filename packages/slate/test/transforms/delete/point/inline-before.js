/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
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
  </editor>
)

export const output = (
  <editor>
    <block>
      word
      <cursor />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
