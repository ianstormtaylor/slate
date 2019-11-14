/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block void>
      <anchor />
    </block>
    <block void>
      <text />
    </block>
    <block>
      <focus />
      one
    </block>
    <block>two</block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      one
    </block>
    <block>two</block>
  </value>
)
