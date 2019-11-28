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
      two
    </block>
    <block>
      three <focus />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
