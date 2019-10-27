/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' } })
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
        four<focus />
      </block>
      <block>five</block>
      <block>six</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block key="a">
      <block>one</block>
      <block>two</block>
    </block>
    <block>
      <anchor />three
    </block>
    <block>
      four<focus />
    </block>
    <block key="a">
      <block>five</block>
      <block>six</block>
    </block>
  </value>
)
