/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ at: [0] })
}

export const input = (
  <value>
    <block>
      <block>word</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
  </value>
)
