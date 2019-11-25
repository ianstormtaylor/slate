/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'insert_break' })
}

export const input = (
  <value>
    <block>
      <block>
        on
        <cursor />e
      </block>
      <block>two</block>
    </block>
  </value>
)

export const output = input
