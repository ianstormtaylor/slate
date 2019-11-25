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
        o<cursor />r
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
        oa
        <cursor />r
      </mark>
      d
    </block>
  </value>
)
