/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { reverse: true })
}

export const input = (
  <value>
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
  </value>
)

export const output = (
  <value>
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
  </value>
)
