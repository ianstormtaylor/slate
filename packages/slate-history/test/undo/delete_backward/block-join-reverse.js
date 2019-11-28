/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'delete_backward' })
}

export const input = (
  <editor>
    <block>Hello</block>
    <block>
      <cursor />
      world!
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>Hello</block>
    <block>
      <cursor />
      world!
    </block>
  </editor>
)
