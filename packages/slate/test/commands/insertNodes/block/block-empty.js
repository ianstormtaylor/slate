/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />
    </block>
    <block>not empty</block>
  </value>
)

export const run = editor => {
  editor.insertNodes(
    <block>
      <text />
    </block>
  )
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>not empty</block>
  </value>
)
