/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />
        word
        <focus />
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <cursor />
      </mark>
    </block>
  </value>
)
