/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
}

export const input = (
  <editor>
    <block>
      <anchor />
      one
    </block>
    <block>
      <focus />
      two
    </block>
  </editor>
)

// TODO: the hanging selection here isn't right
export const output = (
  <editor>
    <block>
      a<cursor />
    </block>
    <block>two</block>
  </editor>
)

export const skip = true
