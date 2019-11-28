/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>
      w<anchor />o<focus />
      rd
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w<cursor />
      rd
    </block>
  </editor>
)
