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
      <cursor />
      <inline>hyperlink</inline>
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
    <block>
      <cursor />
      <inline>hyperlink</inline>
      word
    </block>
  </value>
)
