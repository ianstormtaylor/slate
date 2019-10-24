/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ height: 'block' })
}

export const input = (
  <value>
    <block>
      wo<cursor />rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>wo</block>
    <block>
      <cursor />rd
    </block>
  </value>
)
