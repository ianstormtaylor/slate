/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' }, split: true })
}

export const input = (
  <value>
    <block key="a">
      <block>
        <cursor />one
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />one
    </block>
  </value>
)
