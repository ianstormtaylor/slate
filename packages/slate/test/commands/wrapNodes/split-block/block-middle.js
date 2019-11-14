/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block new />, { split: true })
}

export const output = (
  <value>
    <block>w</block>
    <block new>
      <block>
        <anchor />
        or
        <focus />
      </block>
    </block>
    <block>d</block>
  </value>
)
