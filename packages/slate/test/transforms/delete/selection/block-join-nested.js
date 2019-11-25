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
        <block>
          word
          <anchor />
        </block>
        <block>
          <focus />
          another
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <block>
          word
          <cursor />
          another
        </block>
      </block>
    </block>
  </value>
)
