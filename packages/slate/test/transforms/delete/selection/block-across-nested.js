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
      <block>two</block>
    </block>
    <block>
      <block>
        <focus />
        three
      </block>
      <block>four</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        one
        <cursor />
        three
      </block>
    </block>
    <block>
      <block>four</block>
    </block>
  </value>
)
