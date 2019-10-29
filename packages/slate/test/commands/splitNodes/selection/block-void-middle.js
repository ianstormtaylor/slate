/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block>
      on<anchor />e
    </block>
    <block void>two</block>
    <block>
      th<focus />ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>on</block>
    <block>
      <cursor />ree
    </block>
  </value>
)
