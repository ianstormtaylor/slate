/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
      <block>
        <anchor />one
      </block>
      <block>
        <focus />two
      </block>
      <block>three</block>
      <block>four</block>
      <block>five</block>
      <block>six</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />one
    </block>
    <block>
      <focus />two
    </block>
    <block key="a">
      <block>three</block>
      <block>four</block>
      <block>five</block>
      <block>six</block>
    </block>
  </value>
)
