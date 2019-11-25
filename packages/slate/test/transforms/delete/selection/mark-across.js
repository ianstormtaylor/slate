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
        wo
      </mark>
      rd
    </block>
    <block>
      two
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)
