/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' }, split: true })
}

export const input = (
  <value>
    <block key="a">
      <block>
        <anchor />one
      </block>
      <block>two</block>
      <block>three</block>
      <block>four</block>
      <block>five</block>
      <block>
        six<focus />
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />one
    </block>
    <block>two</block>
    <block>three</block>
    <block>four</block>
    <block>five</block>
    <block>
      six<focus />
    </block>
  </value>
)
