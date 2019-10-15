/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodeAtPoint({ path: [0, 0], offset: 2 }, { height: 1 })
}

export const input = (
  <value>
    <block>
      <text>word</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>wo</block>
    <block>rd</block>
  </value>
)
