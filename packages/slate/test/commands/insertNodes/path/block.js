/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />one
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodes(
    <block>
      <text />
    </block>,
    { at: [0] }
  )
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <cursor />one
    </block>
  </value>
)
