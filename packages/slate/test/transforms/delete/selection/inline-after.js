/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      one<inline>two</inline>
      <anchor />a<focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one<inline>two</inline>
      <text>
        <cursor />
      </text>
    </block>
  </value>
)
