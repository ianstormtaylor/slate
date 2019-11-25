/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'insert_text', text: 'text' })
}

export const input = (
  <value>
    <block>
      one
      <cursor />
    </block>
  </value>
)

export const output = input
