/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'Cat')
}

export const input = (
  <editor>
    <block>
      <mark key="a">
        <cursor />
      </mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark key="a">
        Cat
        <cursor />
      </mark>
    </block>
  </editor>
)
