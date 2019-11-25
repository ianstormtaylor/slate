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
  <value>
    <block>
      one
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      onew
      <cursor />t
    </block>
  </value>
)

export const skip = true
