/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.liftNodes({ at: [0, 0] })
}

export const input = (
  <value>
    <block>
      <block>word</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
  </value>
)
