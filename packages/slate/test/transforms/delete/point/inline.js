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
      <cursor />
    </block>
    <block>
      two<inline>three</inline>four
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <cursor />
      two<inline>three</inline>four
    </block>
  </editor>
)
