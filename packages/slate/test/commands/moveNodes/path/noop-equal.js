/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>1</block>
    <block>2</block>
  </value>
)

export const run = editor => {
  editor.moveNodes({ at: [1], to: [1] })
}

export const output = (
  <value>
    <block>1</block>
    <block>2</block>
  </value>
)
