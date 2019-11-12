/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: true }, { at: [] })
}

export const input = (
  <value>
    <block>word</block>
    <block>another</block>
  </value>
)

export const output = (
  <value key>
    <block>word</block>
    <block>another</block>
  </value>
)
