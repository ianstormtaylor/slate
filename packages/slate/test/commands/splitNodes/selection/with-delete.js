/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ depth: 'block' })
}

export const input = (
  <value>
    <block>
      w<anchor />or<focus />d
    </block>
  </value>
)

export const output = (
  <value>
    <block>w</block>
    <block>
      <cursor />d
    </block>
  </value>
)

export const skip = true
