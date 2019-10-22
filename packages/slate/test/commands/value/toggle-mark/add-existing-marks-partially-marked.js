/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />a
      </mark>
      <mark key="b">
        wo<focus />rd
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <anchor />a
      </mark>
      <mark key="a">
        <mark key="b">wo</mark>
      </mark>
      <mark key="b">
        <focus />rd
      </mark>
    </block>
  </value>
)
