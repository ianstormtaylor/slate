/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <mark key="b">
          <anchor />rd
        </mark>
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <mark key="b">an</mark>
        <focus />other
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <mark key="a">
          <anchor />rd
        </mark>
      </inline>
      <mark key="a" />
    </block>
    <block>
      <mark key="a" />
      <inline>
        <mark key="a">an</mark>
        <focus />other
      </inline>
      <text />
    </block>
  </value>
)
