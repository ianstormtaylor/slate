/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character', reverse: true })
}

export const input = (
  <editor>
    <block>
      a<cursor />
      <inline>two</inline>
      three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <cursor />
      <inline>two</inline>
      three
    </block>
  </editor>
)
