/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ depth: 'block' })
}

export const input = (
  <value>
    <block>word</block>
    <block>
      <cursor />another
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
    <block>
      <text />
    </block>
    <block>
      <cursor />another
    </block>
  </value>
)
