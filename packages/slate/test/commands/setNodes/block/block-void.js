/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ thing: true }, { match: 'block' })
}

export const input = (
  <value>
    <block void>
      <cursor />word
    </block>
  </value>
)

export const output = (
  <value>
    <block void thing>
      <cursor />word
    </block>
  </value>
)
