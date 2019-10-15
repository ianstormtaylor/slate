/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPoint({ path: [0, 2], offset: 0 }, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text>a</text>
      <inline void>
        <text />
      </inline>
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
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
