/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />word
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodeAtPath([0, 0], <text>another</text>)
}

export const output = (
  <value>
    <block>
      another<cursor />word
    </block>
  </value>
)
