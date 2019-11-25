/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </value>
)

export const run = editor => {
  Editor.removeNodes(editor, { at: [0, 1] })
}

export const output = (
  <value>
    <block>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </value>
)
