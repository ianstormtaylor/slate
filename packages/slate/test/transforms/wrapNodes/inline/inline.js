/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.wrapNodes(editor, <inline a />)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline a>
        <text />
        <inline>
          <cursor />
          word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
