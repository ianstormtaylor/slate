/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character', reverse: true })
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
    <block>
      <cursor />word
    </block>
  </value>
)
