/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.setNodes({ key: true })
}

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const output = input
