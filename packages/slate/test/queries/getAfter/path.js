/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return editor.getAfter([0, 0])
}

export const output = { path: [1, 0], offset: 0 }
