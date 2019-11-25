/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      <block>
        word
        <cursor />
      </block>
      <block>another</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        word
        <cursor />
        another
      </block>
    </block>
  </value>
)
