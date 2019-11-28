/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character', distance: 3, reverse: true })
}

export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w<cursor />
    </block>
  </editor>
)
