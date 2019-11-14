/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.unwrapNodes({ key: 'a' })
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <block a>
      <block>
        <cursor />
        one
      </block>
      <block>two</block>
      <block>three</block>
    </block>
  </value>
)

export const output = input
