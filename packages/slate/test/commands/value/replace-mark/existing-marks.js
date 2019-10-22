/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <block>
      <mark key="b">
        <anchor />wo<focus />rd
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />
      <mark key="a">wo</mark>
      <mark key="b">
        <focus />rd
      </mark>
    </block>
  </value>
)
