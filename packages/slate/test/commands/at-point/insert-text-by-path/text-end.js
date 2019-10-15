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
  editor.insertTextAtPoint({ path: [0, 0], offset: 4 }, 'x')
}

export const output = (
  <value>
    <block>wordx</block>
  </value>
)
