/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        wo<cursor />rd
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline void>word</inline>
      <text />
    </block>
    <block>
      <cursor />
    </block>
  </value>
)
