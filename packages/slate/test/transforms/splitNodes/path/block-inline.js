/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: [0, 2] })
}

export const input = (
  <editor>
    <block>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text />
      <inline>one</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </editor>
)
