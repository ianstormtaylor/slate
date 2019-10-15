/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>
      <text />
    </block>
  </value>
)
