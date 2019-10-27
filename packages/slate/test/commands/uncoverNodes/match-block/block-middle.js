/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.uncoverNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
      <block>one</block>
      <block>two</block>
      <block>
        <anchor />three
      </block>
      <block>
        <focus />four
      </block>
      <block>five</block>
      <block>six</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
    <block>two</block>
    <block>
      <anchor />three
    </block>
    <block>
      <focus />four
    </block>
    <block>five</block>
    <block>six</block>
  </value>
)
