/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
      <block>
        <cursor />word
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />word
    </block>
  </value>
)
