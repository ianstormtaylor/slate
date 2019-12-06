/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.liftNodes(editor, { at: [0, 0], voids: true })
}

export const input = (
  <editor>
    <block void>
      <block>word</block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>word</block>
  </editor>
)
