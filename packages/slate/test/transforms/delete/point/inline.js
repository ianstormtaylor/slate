/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      one
      <cursor />
    </block>
    <block>
      two<inline>three</inline>four
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
      two<inline>three</inline>four
    </block>
  </value>
)
