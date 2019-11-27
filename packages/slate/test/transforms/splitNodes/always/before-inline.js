/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'block', always: true })
}

export const input = (
  <editor>
    <block>
      word
      <cursor />
      <inline>hyperlink</inline>
      word
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>word</block>
    <block>
      <cursor />
      <inline>hyperlink</inline>
      word
    </block>
  </editor>
)
