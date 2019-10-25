/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />word
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block a />)
}

export const output = (
  <value>
    <block a>
      <block>
        <cursor />word
      </block>
    </block>
  </value>
)
