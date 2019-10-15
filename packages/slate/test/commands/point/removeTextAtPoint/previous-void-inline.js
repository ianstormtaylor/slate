/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPoint({ path: [0, 2], offset: 0 }, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text>a</text>
      <inline>two</inline>
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
      <inline>two</inline>
      <text />
    </block>
  </value>
)
