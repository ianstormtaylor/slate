/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapNodes(<block a />, { depth: -1 })
}

export const input = (
  <value>
    <block>
      <text>word</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block a>word</block>
    </block>
  </value>
)
