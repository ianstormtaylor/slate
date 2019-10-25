/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ depth: 'block' })
}

export const input = (
  <value>
    <block>zero</block>
    <block>
      <anchor />word
    </block>
    <block>
      <focus />cat is cute
    </block>
  </value>
)

export const output = (
  <value>
    <block>zero</block>
    <block>
      <text />
    </block>
    <block>
      <cursor />cat is cute
    </block>
  </value>
)

export const skip = true
