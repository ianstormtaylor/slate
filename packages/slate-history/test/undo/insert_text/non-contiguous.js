/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'insert_text', text: 't' })
  // editor.move({ reverse: true })
  editor.exec({ type: 'insert_text', text: 'w' })
  // editor.move({ reverse: true })
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

export const output = (
  <editor>
    <block>
      onew
      <cursor />t
    </block>
  </editor>
)

export const skip = true
