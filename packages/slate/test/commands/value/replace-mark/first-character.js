/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <block>
      <anchor />
      <mark key="b">w</mark>
      <focus />ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />
      <mark key="a">w</mark>
      <focus />ord
    </block>
  </value>
)
