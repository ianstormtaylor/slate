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
        one
        <anchor />
      </block>
    </block>
    <block>
      <focus />
      two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        one
        <cursor />
        two
      </block>
    </block>
  </value>
)
