/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <anchor />one
    </block>
    <block>
      two<focus />
    </block>
    <block>three</block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block a />)
}

export const output = (
  <value>
    <block a>
      <block>
        <anchor />word<focus />
      </block>
    </block>
  </value>
)
