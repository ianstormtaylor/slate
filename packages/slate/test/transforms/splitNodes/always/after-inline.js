/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'block', always: true })
}

export const input = (
  <value>
    <block>
      word
      <inline>hyperlink</inline>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word
      <inline>hyperlink</inline>
      <text />
    </block>
    <block>
      <cursor />
      word
    </block>
  </value>
)
