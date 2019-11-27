/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
}

export const input = (
  <editor>
    <block>
      w
      <mark key="a">
        or
        <cursor />
      </mark>
      d
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w
      <mark key="a">
        ora
        <cursor />
      </mark>
      d
    </block>
  </editor>
)
