/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 1, 0], 3, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <text>word</text>
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>wor</inline>
      <text />
    </block>
  </value>
)
