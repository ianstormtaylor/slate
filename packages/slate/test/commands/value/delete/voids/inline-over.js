/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <anchor />Hi
    </block>
    <block>there</block>
    <block>
      <inline void>
        <text />
      </inline>
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)

export const skip = true