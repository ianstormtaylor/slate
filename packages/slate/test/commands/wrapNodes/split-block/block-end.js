/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      wo
      <anchor />
      rd
      <focus />
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block new />, { split: true })
}

export const output = (
  <value>
    <block>wo</block>
    <block new>
      <block>
        <anchor />
        rd
        <focus />
      </block>
    </block>
  </value>
)
