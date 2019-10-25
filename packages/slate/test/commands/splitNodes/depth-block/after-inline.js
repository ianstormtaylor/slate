/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ depth: 'block' })
}

export const input = (
  <value>
    <block>
      word
      <inline>hyperlink</inline>
      <cursor />word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word
      <inline>hyperlink</inline>
      <text />
    </block>
    <block>
      <cursor />word
    </block>
  </value>
)
