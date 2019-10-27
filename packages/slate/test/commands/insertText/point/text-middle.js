/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <text>word</text>
    </block>
  </value>
)

export const run = editor => {
  editor.insertText('x', { at: { path: [0, 0], offset: 2 } })
}

export const output = (
  <value>
    <block>woxrd</block>
  </value>
)
