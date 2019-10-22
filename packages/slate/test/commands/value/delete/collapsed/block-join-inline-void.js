/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    <block>
      <inline void>
        <text />
      </inline>
    </block>
    <block>
      <cursor />word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline void>
        <text />
      </inline>
      <cursor />word
    </block>
  </value>
)
