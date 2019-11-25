/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.wrapNodes(editor, <inline a />)
}

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline a>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </value>
)
