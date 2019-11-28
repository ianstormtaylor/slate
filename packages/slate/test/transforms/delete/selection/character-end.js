/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>
      wor
      <anchor />d<focus />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      wor
      <cursor />
    </block>
  </editor>
)
