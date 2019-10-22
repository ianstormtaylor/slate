/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>

    <block>
      <anchor />one
      </block>
    <block>two</block>
    <block>three</block>
    <block>
      four<focus />
    </block>

  </value>
)

export const output = (
  <value>

    <block>
      <cursor />
    </block>

  </value>
)
