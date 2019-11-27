/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'insert_text', text: 't' })
  editor.exec({ type: 'insert_text', text: 'w' })
  editor.exec({ type: 'insert_text', text: 'o' })
}

export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)

export const output = input
