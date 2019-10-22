/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setBlocks({
    type: 'code',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>

    <block>
      <cursor />word
      </block>

  </value>
)

export const output = (
  <value>

    <code thing="value">
      <cursor />word
      </block>

  </value>
)
