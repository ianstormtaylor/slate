/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character', reverse: true })
}

export const input = (
  <value>
    <block>
      one
      <inline>two</inline>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline>tw</inline>
      <cursor />
    </block>
  </value>
)
