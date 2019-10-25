/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>
      <cursor />two
    </block>
    <block>three</block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block a />)
}

export const output = (
  <value>
    <block>one</block>
    <block a>
      <block>
        <cursor />two
      </block>
    </block>
    <block>three</block>
  </value>
)
