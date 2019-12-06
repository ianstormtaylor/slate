/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'four')
}

export const input = (
  <editor>
    <block>
      one
      <inline>
        two
        <cursor />
      </inline>
      three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <inline>two</inline>
      fourthree
      <cursor />
    </block>
  </editor>
)
