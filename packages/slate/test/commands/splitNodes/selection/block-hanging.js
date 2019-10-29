/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
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
      <cursor />cat is cute
    </block>
  </value>
)
