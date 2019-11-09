/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.texts({ at: [], reverse: true }))
}

export const output = [[<text>two</text>, [1, 0]], [<text>one</text>, [0, 0]]]
