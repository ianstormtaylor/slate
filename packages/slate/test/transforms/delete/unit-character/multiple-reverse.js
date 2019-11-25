/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character', distance: 3, reverse: true })
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w<cursor />
    </block>
  </value>
)
