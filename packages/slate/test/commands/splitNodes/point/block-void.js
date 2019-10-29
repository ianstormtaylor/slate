/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: { path: [0, 0], offset: 2 } })
}

export const input = (
  <value>
    <block void>word</block>
  </value>
)

export const output = (
  <value>
    <block void>word</block>
  </value>
)
