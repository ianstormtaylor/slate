/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <block>
      wo
      <mark key="b">
        <anchor />rd
      </mark>
    </block>
    <block>
      <mark key="b">an</mark>
      <focus />other
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark key="a">
        <anchor />rd
      </mark>
    </block>
    <block>
      <mark key="a">an</mark>
      <focus />other
    </block>
  </value>
)
