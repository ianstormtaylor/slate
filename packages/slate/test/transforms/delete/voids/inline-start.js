/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>
      one
      <inline void>
        <anchor />
      </inline>
      <focus />
      two
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <cursor />
      two
    </block>
  </editor>
)
