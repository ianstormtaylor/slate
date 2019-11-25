/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      w<anchor />o<focus />
      rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w<cursor />
      rd
    </block>
  </value>
)
