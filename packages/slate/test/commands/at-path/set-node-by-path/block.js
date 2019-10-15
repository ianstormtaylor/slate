/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setNodeAtPath([0], { key: 'a' })
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block key="a">word</block>
  </value>
)
