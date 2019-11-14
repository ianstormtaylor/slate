/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 'block', always: true })
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
    <block>another</block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
    <block>
      <cursor />
    </block>
    <block>another</block>
  </value>
)
