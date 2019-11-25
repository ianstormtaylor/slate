/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
  </value>
)

export const run = editor => {
  return Editor.match(editor, [0, 0, 0], 'block')
}

export const output = [<block>one</block>, [0, 0]]
