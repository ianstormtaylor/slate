/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block>zero</block>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      cat is cute
    </block>
  </value>
)

export const output = (
  <value>
    <block>zero</block>
    <block>
      <cursor />
    </block>
    <block>cat is cute</block>
  </value>
)

export const skip = true
