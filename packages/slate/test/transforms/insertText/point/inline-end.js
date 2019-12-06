/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one
      <inline>two</inline>
      three
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertText(editor, 'four', { at: { path: [0, 1, 0], offset: 3 } })
}

export const output = (
  <editor>
    <block>
      one
      <inline>twofour</inline>
      three
    </block>
  </editor>
)
