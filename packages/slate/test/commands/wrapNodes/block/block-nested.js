/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block a>
      <block>
        w<anchor />or<focus />d
      </block>
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block new />)
}

export const output = (
  <value>
    <block a>
      <block>w</block>
      <block new>
        <block>
          <anchor />or<focus />
        </block>
      </block>
      <block>d</block>
    </block>
  </value>
)
