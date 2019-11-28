/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>
      <block>
        one
        <anchor />
      </block>
    </block>
    <block>
      <focus />
      two
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <block>
        one
        <cursor />
        two
      </block>
    </block>
  </editor>
)
