/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
}

export const input = (
  <value>
    <block>
      w
      <mark key="a">
        or
        <cursor />
      </mark>
      d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w
      <mark key="a">
        ora
        <cursor />
      </mark>
      d
    </block>
  </value>
)
