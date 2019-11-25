/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        word
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline void>word</inline>
      <text />
    </block>
    <block>
      <cursor />
    </block>
  </value>
)
