/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: [0, 2] })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </value>
)
