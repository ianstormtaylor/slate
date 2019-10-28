/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      <text />
      <inline key="a">
        <anchor />one
      </inline>
      two
      <inline key="a">
        three<focus />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />onetwothree<focus />
    </block>
  </value>
)
