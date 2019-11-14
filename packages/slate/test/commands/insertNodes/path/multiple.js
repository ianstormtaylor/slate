/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodes([<block>two</block>, <block>three</block>], { at: [0] })
}

export const output = (
  <value>
    <block>two</block>
    <block>three</block>
    <block>
      <cursor />
      one
    </block>
  </value>
)
