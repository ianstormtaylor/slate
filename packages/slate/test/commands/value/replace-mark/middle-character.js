/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <block>
      w
      <mark key="b">
        <anchor />o
      </mark>
      <focus />rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w
      <mark key="a">
        <anchor />o
      </mark>
      <focus />rd
    </block>
  </value>
)
