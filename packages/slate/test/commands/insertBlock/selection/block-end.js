/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      word<cursor />
    </block>
  </value>
)

export const run = editor => {
  editor.insertBlock(
    <block>
      <text />
    </block>
  )
}

export const output = (
  <value>
    <block>word</block>
    <block>
      <cursor />
    </block>
  </value>
)
