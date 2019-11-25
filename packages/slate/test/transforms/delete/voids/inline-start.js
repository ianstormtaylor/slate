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
      <inline void>
        <anchor />
      </inline>
      <focus />
      two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
      two
    </block>
  </value>
)
