/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { reverse: true })
}

export const input = (
  <editor>
    <block>
      one
      <inline>two</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <cursor />
        three
      </inline>
      four
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <inline>two</inline>
      <text />
      <inline>
        <cursor />
        three
      </inline>
      four
    </block>
  </editor>
)
